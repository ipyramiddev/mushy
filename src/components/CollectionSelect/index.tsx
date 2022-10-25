import { History, LocationState } from "history";
import { MutableRefObject } from "react";
import * as ROUTES from "../../constants/routes";
import { Collection } from "../../types";
import { StyledSelect } from "../StyledSelect";

const getCollectionsDropdown = (collections: Collection[], topCollections: Collection[]) => {
  const collectionDropdown: {
    label: string;
    options: { label: string; value: string }[];
  }[] = [];

  collectionDropdown.push(
    {
      label: 'Top Collections',
      options: topCollections.map((topCollection: Collection) => {
        return {
          value: `${ROUTES.COLLECTIONS}/${topCollection?.name}`,
          label: topCollection?.name?.toUpperCase(),
        }
      })
    },
    {
      label: 'All Collections',
      options: collections.map((collection: Collection) => {
        return {
          value: `${ROUTES.COLLECTIONS}/${collection?.name}`,
          label: collection?.name?.toUpperCase(),
        }
      })
    }
  );

  return collectionDropdown;
};

const CollectionSelect = ({
  collections,
  topCollections,
  onClose,
  history,
  menuIsOpen,
  darkMode,
}: {
  collections: Collection[];
  topCollections: Collection[];
  onClose: (
    focusableElement?: HTMLElement | MutableRefObject<HTMLElement | null>
  ) => void;
  history: History<LocationState>;
  menuIsOpen?: boolean;
  darkMode?: boolean;
}) => {
  const lightTheme = {
    menu: (provided: any) => ({
      ...provided,
      boxShadow: "none",
      borderRadius: "0",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      paddingLeft: "24px",
      backgroundColor: "var(--color-main-primary)",
      color: "var(--color-main-secondary)",
      "&:hover": {
        backgroundColor: "#D1D5DB",
        color: "#000",
      },
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      margin: "0",
      boxSizing: "border-box",
      // paddingLeft: "0",
      color: "var(--color-main-secondary)",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      paddingLeft: "0px",
      left: "6px",
      opacity: 0.5,
      position: "absolute",
      fontWeight: "300",
      color: "var(--color-main-secondary)",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0 12px",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      display: "none",
    }),
    menuList: (provided: any) => ({
      ...provided,
      backgroundColor: "var(--color-main-primary)",
      border: "none",
    }),
  };

  const darkTheme = {
    menu: (provided: any) => ({
      ...provided,
      boxShadow: "0px 4px 20px 0px #0000001A",
      borderRadius: "6px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      paddingLeft: "24px",
      backgroundColor: "var(--color-main-primary)",
      color: "var(--color-main-secondary)",
      "&:hover": {
        backgroundColor: "#D1D5DB",
        color: "#000",
      },
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      margin: "0",
      boxSizing: "border-box",
      paddingRight: "0",
      color: "#fff",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      paddingLeft: "0px",
      left: "36px",
      opacity: 0.5,
      position: "absolute",
      fontWeight: "300",
      marginTop: "1px",
      color: "#fff",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0 36px",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      display: "none",
    }),
    control: (provided: any) => ({
      ...provided,
      boxShadow: "none",
      backgroundColor: "transparent",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23555'%3E%3Cpath fill-rule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clip-rule='evenodd' /%3E%3C/svg%3E\")",
      backgroundSize: "22px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "8px 8px",
      border: "none",
      "&:hover": {
        borderColor: "none",
      },
      color: "var(--color-main-secondary)",
    }),
  };

  return (
    <StyledSelect
      menuIsOpen={menuIsOpen}
      menuPortalTarget={document.body}
      options={getCollectionsDropdown(collections, topCollections)}
      placeholderPrefix={""}
      onChange={(option: any) => {
        if (option) {
          history.push(option.value);
          onClose();
        }
      }}
      placeholder="Search Collections"
      styles={darkMode ? darkTheme : lightTheme}
      controlShouldRenderValue={false}
    />
  );
};

export default CollectionSelect;
