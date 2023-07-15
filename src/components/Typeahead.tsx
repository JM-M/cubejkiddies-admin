import { useState, useRef } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonSearchbar,
  IonToolbar,
  IonRadio,
  IonRadioGroup,
  IonModal,
  IonLabel,
  IonIcon,
  IonText,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import cx from 'classnames';

interface TypeaheadProps {
  name: string;
  register: any;
  value: string;
  items: any[];
  title?: string;
  closeModal?: () => void;
  onSelectionChange?: (item?: any) => void;
  error: any;
}

const Typeahead = ({
  name,
  register,
  value,
  items,
  title,
  onSelectionChange = () => null,
  error,
}: TypeaheadProps) => {
  const [filteredItems, setFilteredItems] = useState<any[]>([...items]);

  const categoriesModal = useRef<HTMLIonModalElement>(null);

  const closeModal = () => {
    setFilteredItems(items);
    categoriesModal.current?.dismiss();
  };

  const cancelChanges = () => {
    if (closeModal !== undefined) {
      closeModal();
    }
  };

  const searchbarInput = (ev: any) => {
    filterList(ev.target.value);
  };

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  const filterList = (searchQuery: string | null | undefined) => {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined || searchQuery === null) {
      setFilteredItems([...items]);
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter((item) => {
          return item.text.toLowerCase().includes(normalizedQuery);
        })
      );
    }
  };

  return (
    <>
      <IonItem
        className={cx({
          'ion-invalid': !!error,
          'ion-valid': !error,
        })}
        button={true}
        detail={false}
        id={`select-${name}`}
      >
        <IonLabel>Category</IonLabel>
        <div slot='end' id={`selected-${name}`}>
          {value}
        </div>
      </IonItem>
      {error && (
        <IonText
          color='danger'
          slot='end'
          className='block pt-1 text-left text-xs border-t border-[var(--ion-color-danger)]'
        >
          {error?.message}
        </IonText>
      )}
      <IonModal trigger={`select-${name}`} ref={categoriesModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonButton onClick={cancelChanges}>
                <IonIcon icon={closeOutline} className='h-[24px] w-[24px]' />
              </IonButton>
            </IonButtons>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar onIonInput={searchbarInput}></IonSearchbar>
          </IonToolbar>
        </IonHeader>

        <IonContent color='light' class='ion-padding'>
          <IonList id='modal-list' inset={true}>
            <IonRadioGroup
              {...register(name)}
              value={value}
              onIonChange={(ev) => {
                onSelectionChange(ev.target.value);
                closeModal();
              }}
            >
              {filteredItems.map((item) => (
                <IonItem key={item.value}>
                  <IonRadio value={item.value}>{item.text}</IonRadio>
                </IonItem>
              ))}
            </IonRadioGroup>
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};
export default Typeahead;
