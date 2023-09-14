import { useState } from 'react';
import { IonSpinner, IonIcon, IonButton } from '@ionic/react';
import {
  addOutline,
  caretDownCircle,
  caretDownCircleOutline,
} from 'ionicons/icons';
import cx from 'classnames';
import Expandable from './Expandable';
import CategoriesActions from './CategoryActions';
import CategoryInput from './CategoryInput';
import useCategories, { Category } from '../hooks/useCategories';
import CategoryDeleteModal from './CategoryDeleteModal';
import PageLoader from './PageLoader';

const ROOT_CATEGORY = {
  name: '',
  value: '/',
  parent: null,
};

const CategoryEditor = ({
  category = ROOT_CATEGORY,
}: {
  category?: Category;
}) => {
  const { name, value, id } = category;
  const isRootCategory = value === ROOT_CATEGORY.value;
  const [open, setOpen] = useState<boolean>(isRootCategory);
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);
  const [toBeDeleted, setToBeDeleted] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

  const closeCategoryInput = () => setShowCategoryInput(false);
  const closeDeletionModal = () => setToBeDeleted(false);

  const {
    categoriesQuery,
    saveCategory,
    saveMutation,
    createCategoryValueFromName,
    getChildCategories,
    deleteCategory,
    deletionMutation,
  } = useCategories({
    onSaveCategorySuccess: closeCategoryInput,
    onDeleteDocumentSuccess: closeDeletionModal,
  });

  const toggle = () => setOpen((v) => !v);

  const addCategory = (name: string) => {
    let parent = value;
    saveCategory({
      name,
      value: createCategoryValueFromName({ name, parent }),
      parent,
    });
  };

  const updateCategory = (name: string) => {
    saveCategory({
      ...category,
      name,
    });
  };

  const saving = saveMutation.isLoading;

  const childCategories = getChildCategories(value);

  if (categoriesQuery.isFetching) return <PageLoader />;

  const header = (
    <div className='flex items-center gap-5 h-12'>
      <IonIcon
        icon={open ? caretDownCircle : caretDownCircleOutline}
        color='primary'
        className={cx(
          'h-[24px] w-[24px] transition-transform ease-out duration-300 delay-0',
          { 'rotate-180': open, 'rotate-0': !open }
        )}
        onClick={toggle}
      />
      {editing ? (
        <CategoryInput
          initialValue={name}
          save={updateCategory}
          saving={saving}
          cancel={() => setEditing(false)}
        />
      ) : (
        <>
          <span onClick={toggle}>{name}</span>
          <CategoriesActions
            onAdd={() => {
              if (!open) setOpen(true);
              setShowCategoryInput(true);
            }}
            onEdit={() => setEditing(true)}
            onDelete={() => setToBeDeleted(true)}
          />
        </>
      )}
    </div>
  );

  return (
    <>
      {toBeDeleted && (
        <CategoryDeleteModal
          categoryName={name}
          deleteHandler={() => {
            deleteCategory(category);
          }}
          deleting={deletionMutation.isLoading}
          close={closeDeletionModal}
          open
        />
      )}
      {!isRootCategory && header}
      {isRootCategory && !categoriesQuery.data?.docs?.length && (
        <div className='text-gray-500'>No categories added</div>
      )}
      <Expandable
        open={isRootCategory || open}
        className={cx({ 'pl-5': !isRootCategory })}
      >
        {childCategories.map((category: Category, index: number) => {
          return <CategoryEditor key={index} category={category} />;
        })}
        {showCategoryInput ? (
          <CategoryInput
            save={addCategory}
            saving={saving}
            cancel={() => setShowCategoryInput(false)}
          />
        ) : (
          isRootCategory && (
            <IonButton
              fill='outline'
              className='mt-3'
              onClick={() => {
                setShowCategoryInput(true);
              }}
            >
              <IonIcon
                icon={addOutline}
                color='primary'
                slot='start'
                className='h-[20px] w-[20px]'
              />
              Add root category
            </IonButton>
          )
        )}
      </Expandable>
    </>
  );
};

export default CategoryEditor;
