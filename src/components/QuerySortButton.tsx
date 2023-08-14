import { useState, useRef } from "react";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { IonButton, IonPopover, IonContent } from "@ionic/react";
import cx from "classnames";

interface Props {
  options: any[];
  onSort: (option: string) => void;
}

const QuerySortButton = ({ options = [], onSort }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popover = useRef<HTMLIonPopoverElement>(null);

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  const dismissPopover = () => {
    popover.current?.dismiss();
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    if (typeof onSort === "function") onSort(option);
    dismissPopover();
  };

  return (
    <>
      <IonButton
        color="dark"
        fill="clear"
        className="ion-no-padding"
        onClick={openPopover}
      >
        <span className="px-1">
          <HiOutlineArrowsUpDown size={18} className="inline-block mr-1" />
          Sort
          {selectedOption && `: ${selectedOption}`}
        </span>
      </IonButton>
      <IonPopover
        ref={popover}
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
      >
        <IonContent className="ion-padding ion-no-border rounded-xl overflow-hidden">
          <h3 className="mb-3 font-medium text-lg">Sort by</h3>
          <ul>
            {options.map((option: string, i: number) => {
              const selected = option === selectedOption;
              return (
                <li key={i} onClick={() => selectOption(option)}>
                  <div
                    className={cx(
                      "flex items-center px-2 h-10 rounded-lg cursor-pointer hover:bg-gray-200",
                      {
                        "bg-gray-200 text-[var(--ion-color-primary)]": selected,
                      }
                    )}
                  >
                    {option}
                  </div>
                </li>
              );
            })}
          </ul>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default QuerySortButton;
