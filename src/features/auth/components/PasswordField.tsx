"use client";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { TextField, type TextFieldProps } from "./TextField";

export const PasswordField = (
  props: Omit<TextFieldProps, "icon" | "trailing" | "type">,
) => {
  const [show, setShow] = useState(false);
  return (
    <TextField
      {...props}
      icon={Lock}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          {show ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </button>
      }
    />
  );
};
