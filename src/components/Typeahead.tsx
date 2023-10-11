import { useState, useRef, useEffect, useCallback } from 'react';
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
  IonSpinner,
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
  loading?: boolean;
  disabled?: boolean;
}

const Typeahead = ({
  name,
  register,
  value,
  items,
  title,
  onSelectionChange = () => null,
  error,
  disabled = false,
  loading = false,
}: TypeaheadProps) => {
  const [filteredItems, setFilteredItems] = useState<any[]>([...items]);

  const searchQueryRef = useRef<string>(value || '');

  useEffect(() => {
    filterList(searchQueryRef.current);
  }, [items]);

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
  const filterList = useCallback(
    (searchQuery: string | null | undefined) => {
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
        searchQueryRef.current = searchQuery;
      }
    },
    [items]
  );

  const selectedItemText = items.find((item) => item.value === value)?.text;

  return (
    <>
      <IonItem
        className={cx({
          'ion-invalid': !!error,
          'ion-valid': !error,
          'pointer-events-none opacity-50': disabled || loading,
        })}
        button={true}
        detail={false}
        id={`select-${name}`}
      >
        <IonLabel>
          {loading ? (
            <IonSpinner name='crescent' className='h-[20px] w-[20px]' />
          ) : (
            title
          )}
        </IonLabel>
        <div slot='end' id={`selected-${name}`}>
          {!!selectedItemText && selectedItemText}
        </div>
      </IonItem>
      {error && (
        <IonText
          color='danger'
          slot='end'
          className='block pt-1 mx-4 text-left text-xs border-t border-[var(--ion-color-danger)]'
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
            <IonSearchbar onIonInput={searchbarInput} autoFocus></IonSearchbar>
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
              {filteredItems.map((item, i) => (
                <IonItem key={i}>
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
