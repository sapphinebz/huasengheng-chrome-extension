import React, { useCallback, useMemo, useState } from "react";

interface Props {
  muted: boolean;
  onClickToggle?: (newValue: boolean) => void;
}
const MutedIcon: React.FC<Props> = React.memo((props) => {
  const [muted, setMuted] = useState<boolean>(props.muted);

  const VolumeIcon = useMemo(() => {
    if (muted) {
      return (
        <path
          fill="currentColor"
          d="M19.707 5.293a.999.999 0 0 0-1.414 0l-1.551 1.551c-.345-.688-.987-1.02-1.604-1.02c-.449 0-.905.152-1.356.453L11.11 8.058C10.357 8.561 8.904 9 8 9c-1.654 0-3 1.346-3 3v2c0 1.237.754 2.302 1.826 2.76l-1.533 1.533a.999.999 0 1 0 1.414 1.414l2.527-2.527c.697.174 1.416.455 1.875.762l2.672 1.781c.451.301.907.453 1.356.453c.898 0 1.863-.681 1.863-2.176V9.414l2.707-2.707a.999.999 0 0 0 0-1.414m-4.816 2.648l.104-.062L15 8v1.293l-2 2V9.202zM7 12a1 1 0 0 1 1-1c1.211 0 2.907-.495 4-1.146v2.439l-2.83 2.83A6.535 6.535 0 0 0 8 15a1 1 0 0 1-1-1zm3.301 3.406L12 13.707v2.439a8.267 8.267 0 0 0-1.699-.74m4.693 2.714l-.104-.062l-1.89-1.26v-4.091l2-2V18z"
        ></path>
      );
    }
    return (
      <path
        fill="currentColor"
        d="M16.706 10.292a.999.999 0 1 0-1.412 1.416c.345.345.535.803.535 1.291c0 .489-.19.948-.536 1.294a.999.999 0 1 0 1.414 1.414c.724-.723 1.122-1.685 1.122-2.708s-.398-1.984-1.123-2.707m2-2a1 1 0 1 0-1.412 1.416a4.616 4.616 0 0 1 1.364 3.287a4.628 4.628 0 0 1-1.365 3.298a.999.999 0 1 0 1.414 1.414a6.617 6.617 0 0 0 1.951-4.713a6.603 6.603 0 0 0-1.952-4.702m2-2a1 1 0 1 0-1.412 1.416a7.42 7.42 0 0 1 2.192 5.284a7.437 7.437 0 0 1-2.193 5.301a.999.999 0 1 0 1.414 1.414a9.427 9.427 0 0 0 2.779-6.717a9.402 9.402 0 0 0-2.78-6.698m-8.568-.468c-.449 0-.905.152-1.356.453L8.109 8.059C7.357 8.561 5.904 9 5 9c-1.654 0-3 1.346-3 3v2c0 1.654 1.346 3 3 3c.904 0 2.357.439 3.109.941l2.672 1.781c.451.301.907.453 1.356.453c.898.001 1.863-.68 1.863-2.175V8c0-1.495-.965-2.176-1.862-2.176M5 15a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1c1.211 0 2.907-.495 4-1.146v6.293C7.907 15.495 6.211 15 5 15m7 3l-.006.12l-.104-.062l-1.89-1.26V9.202l1.891-1.261l.104-.062L12 8z"
      ></path>
    );
  }, [muted]);

  const clickToggle = useCallback(() => {
    setMuted((muted) => {
      const newValue = !muted;
      props.onClickToggle?.(newValue);
      return newValue;
    });
  }, [setMuted, props.onClickToggle]);

  return (
    <svg
      onClick={clickToggle}
      style={{ cursor: "pointer" }}
      xmlns="http://www.w3.org/2000/svg"
      width="1.5rem"
      height="1.5rem"
      viewBox="0 0 24 24"
    >
      {VolumeIcon}
    </svg>
  );
});

export default MutedIcon;