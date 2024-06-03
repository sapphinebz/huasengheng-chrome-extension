import * as React from "react";

type FormElements = { [key: string]: HTMLInputElement | HTMLSelectElement };

export function useForm<T extends Record<string, any>>() {
  const formRef = React.useRef<HTMLElement>(null);

  const getForm = React.useCallback(() => {
    const formEl = formRef.current;
    if (formEl) {
      const elList = formEl.querySelectorAll<
        HTMLInputElement | HTMLSelectElement
      >("[data-formcontrol-name]");

      const forms = {} as Record<string, any>;

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

  const reset = React.useCallback(() => {
    const form = getForm();
    for (const [name, element] of Object.entries(form)) {
      if (element) {
        element.value = "";
      }
    }
  }, [getForm]);

  const patchValue = React.useCallback(
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

  const disableForm = React.useCallback(() => {
    const form = getForm();
    for (const [name, element] of Object.entries(form)) {
      if (element) {
        element.setAttribute("disabled", "");
      }
    }
  }, [getForm]);

  const getRawValue = React.useCallback(() => {
    const form = getForm();
    const formValue = {} as Record<string, any>;
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

  const form = React.useMemo(
    () => ({ formRef, getForm, patchValue, disableForm, getRawValue, reset }),
    [formRef, getForm, patchValue, disableForm, getRawValue, reset]
  );

  return form;
}
