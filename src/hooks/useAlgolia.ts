import { useMemo } from "react";
import algoliasearch from "algoliasearch";
import { useMutation } from "@tanstack/react-query";

const client = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APPLICATION_ID,
  import.meta.env.VITE_ALGOLIA_ADMIN_API_KEY
);

type AlgoliaRecord = { [key: string]: any };

interface Props {
  index: string;
}

const useAlgolia = (props: Props) => {
  const index = useMemo(() => client.initIndex(props.index), [props.index]);
  const noIndex = !props.index;

  const saveRecordFn = async (record: AlgoliaRecord) => {
    if (noIndex) return;
    await index.saveObject(record).wait();
  };

  const saveRecordMutation = useMutation({
    mutationKey: ["algolia-save-record"],
    mutationFn: saveRecordFn,
  });

  const saveRecord = saveRecordMutation.mutate;

  const searchFn = async (query: string) => {
    if (noIndex) return null;
    const { hits } = await index.search(query);
    return hits;
  };

  const searchMutation = useMutation({
    mutationKey: ["algolia-search", props?.index],
    mutationFn: searchFn,
  });

  const search = searchMutation.mutate;

  const deleteRecordFn = async (recordIds: string[]) => {
    await index.deleteObjects(recordIds).wait();
  };

  const deleteRecordMutation = useMutation({
    mutationKey: ["delete-algolia-record"],
    mutationFn: deleteRecordFn,
  });

  const deleteRecord = deleteRecordMutation.mutate;

  return {
    search,
    searchMutation,
    saveRecord,
    saveRecordMutation,
    deleteRecord,
    deleteRecordMutation,
  };
};

export default useAlgolia;
