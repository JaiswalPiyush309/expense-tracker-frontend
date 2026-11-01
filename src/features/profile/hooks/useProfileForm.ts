"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ProfileErrors, ProfileField, ProfileValues } from "../types";
import { FIELD_ORDER, validateProfile } from "../validation";

export const fieldId = (name: ProfileField) => `profile-${name}`;

export type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved" }
  | { status: "error"; message: string };

type SaveFn = (values: ProfileValues, photo: File | null) => Promise<unknown>;

/**
 * Form state for the profile page: dirty tracking, errors that appear after a
 * field is touched or a save is attempted, photo preview, and a save/discard flow.
 */
export function useProfileForm(initial: ProfileValues, onSave: SaveFn) {
  const [saved, setSaved] = useState<ProfileValues>(initial);
  const [values, setValues] = useState<ProfileValues>(initial);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [touched, setTouched] = useState<Set<ProfileField>>(() => new Set());
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });
  const previewUrl = useRef<string | null>(null);
  const savedPreviewUrl = useRef<string | null>(
    initial.photoUrl?.startsWith("blob:") ? initial.photoUrl : null,
  );
  const valuesRef = useRef(values);
  const photoFileRef = useRef(photoFile);
  valuesRef.current = values;
  photoFileRef.current = photoFile;

  const allErrors: ProfileErrors = useMemo(
    () => validateProfile(values),
    [values],
  );
  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(saved),
    [values, saved],
  );

  const releasePreview = useCallback(() => {
    if (previewUrl.current && previewUrl.current !== savedPreviewUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
    }
    previewUrl.current = null;
  }, []);

  useEffect(
    () => () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      if (
        savedPreviewUrl.current &&
        savedPreviewUrl.current !== previewUrl.current
      ) {
        URL.revokeObjectURL(savedPreviewUrl.current);
      }
    },
    [],
  );

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const clearStatus = useCallback(
    () =>
      setSaveState((s) => (s.status === "idle" ? s : { status: "idle" })),
    [],
  );

  const setField = useCallback((name: ProfileField, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    clearStatus();
  }, [clearStatus]);

  const touch = useCallback((name: ProfileField) => {
    setTouched((t) => (t.has(name) ? t : new Set(t).add(name)));
  }, []);

  /** Pass a File to preview and queue an upload, or null to remove the photo. */
  const setPhoto = useCallback(
    (file: File | null) => {
      releasePreview();
      if (file) {
        const url = URL.createObjectURL(file);
        previewUrl.current = url;
        setValues((v) => ({ ...v, photoUrl: url }));
      } else {
        setValues((v) => ({ ...v, photoUrl: null }));
      }
      setPhotoFile(file);
      clearStatus();
    },
    [clearStatus, releasePreview],
  );

  const errorOf = (name: ProfileField) =>
    submitted || touched.has(name) ? allErrors[name] : undefined;

  /** Props to spread onto an <Input>, <Select> or <Textarea>. */
  const bind = (name: ProfileField) => {
    const error = errorOf(name);
    return {
      id: fieldId(name),
      name,
      value: values[name],
      onChange: (e: { target: { value: string } }) =>
        setField(name, e.target.value),
      onBlur: () => touch(name),
      "aria-invalid": error ? (true as const) : undefined,
      "aria-describedby": error ? `${fieldId(name)}-error` : undefined,
    };
  };

  const discard = () => {
    releasePreview();
    setValues(saved);
    setPhotoFile(null);
    setTouched(new Set());
    setSubmitted(false);
    setSaveState({ status: "idle" });
  };

  const submit = async () => {
    if (!dirty || saveState.status === "saving") return;
    setSubmitted(true);
    const firstInvalid = FIELD_ORDER.find((name) => allErrors[name]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    setSaveState({ status: "saving" });
    const submittedValues = values;
    const submittedPhoto = photoFile;
    try {
      await onSave(submittedValues, submittedPhoto);

      const previousSavedPreview = savedPreviewUrl.current;
      const nextSavedPreview = submittedValues.photoUrl?.startsWith("blob:")
        ? submittedValues.photoUrl
        : null;

      if (
        previousSavedPreview &&
        previousSavedPreview !== nextSavedPreview
      ) {
        URL.revokeObjectURL(previousSavedPreview);
      }
      savedPreviewUrl.current = nextSavedPreview;
      if (previewUrl.current === nextSavedPreview) previewUrl.current = null;

      setSaved(submittedValues);
      const changedDuringSave =
        valuesRef.current !== submittedValues ||
        photoFileRef.current !== submittedPhoto;
      if (!changedDuringSave) {
        setPhotoFile(null);
        setTouched(new Set());
        setSubmitted(false);
      }
      setSaveState({ status: "saved" });
    } catch (err) {
      setSaveState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Couldn't save your changes. Try again.",
      });
    }
  };

  return {
    values,
    saved,
    dirty,
    saveState,
    bind,
    errorOf,
    setField,
    setPhoto,
    discard,
    submit,
  };
}

export type ProfileForm = ReturnType<typeof useProfileForm>;
