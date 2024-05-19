import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type FormElements = { [key: string]: HTMLInputElement | HTMLSelectElement };

export function useForm<T = any>() {
  const formRef = useRef<HTMLElement>(null);

  const getForm = useCallback(() => {
    const formEl = formRef.current;
    if (formEl) {
      const elList = formEl.querySelectorAll<
        HTMLInputElement | HTMLSelectElement
      >("[data-formcontrol-name]");

      const forms = {};

      for (const el of elList) {
        const name = el.dataset.formcontrolName;
        if (name) {
          forms[name] = el;
        }
      }

      return forms as FormElements;
    }
    return {} as FormElements;
  }, [formRef]);

  const reset = useCallback(() => {
    const form = getForm();
    for (const [name, element] of Object.entries(form)) {
      if (element) {
        element.value = "";
      }
    }
  }, [getForm]);

  const patchValue = useCallback(
    (model: T) => {
      const form = getForm();
      for (const [name, element] of Object.entries(form)) {
        if (element) {
          if (
            element instanceof HTMLInputElement &&
            element.type === "number"
          ) {
            element.valueAsNumber = model[name];
          } else if (
            element instanceof HTMLInputElement &&
            element.type === "text"
          ) {
            element.value = model[name];
          } else if (element instanceof HTMLSelectElement) {
            element.value = model[name];
          }
        }
      }
    },
    [getForm]
  );

  const disableForm = useCallback(() => {
    const form = getForm();
    for (const [name, element] of Object.entries(form)) {
      if (element) {
        element.setAttribute("disabled", "");
      }
    }
  }, [getForm]);

  const getRawValue = useCallback(() => {
    const form = getForm();
    const formValue = {} as T;
    for (const [name, element] of Object.entries(form)) {
      if (element) {
        if (element instanceof HTMLInputElement && element.type === "number") {
          formValue[name] = element.valueAsNumber;
        } else if (
          element instanceof HTMLInputElement &&
          element.type === "text"
        ) {
          formValue[name] = element.value;
        } else if (element instanceof HTMLSelectElement) {
          formValue[name] = element.value;
        }
      }
    }
    return formValue;
  }, [getForm]);

  const form = useMemo(
    () => ({ formRef, getForm, patchValue, disableForm, getRawValue, reset }),
    [formRef, getForm, patchValue, disableForm, getRawValue, reset]
  );

  return form;
}
