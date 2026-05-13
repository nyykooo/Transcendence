import useAutocomplete, {
  type AutocompleteGetItemProps,
  type UseAutocompleteProps,
} from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { FormControl } from '@mui/material';

const Label = styled('label')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '14px',
  transform: 'translateY(-50%)',
  fontSize: '16px',
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.text.secondary,
  pointerEvents: 'none',
  transition: 'all 0.2s ease',
  backgroundColor: "transparent",
  paddingInline: '4px',

  '&.shrink': {
    top: 0,
    fontSize: '12px',
    color: theme.palette.primary.main,
  },
}));

const InputWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: '16px 32px 16px 14px',
  boxSizing: 'border-box',
  backgroundColor: 'transparent',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '4px',

  '&:hover fieldset': {
    borderColor: theme.palette.text.primary,
  },
  '&.focused fieldset': {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
  },
  '& input': {
    font: 'inherit',
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    height: '24px',
    boxSizing: 'border-box',
    padding: '0',
    minWidth: '80px',
    flexGrow: 1,
    border: 0,
    margin: 0,
    outline: 0,
  },
}));

const StyledFieldset = styled('fieldset')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  margin: 0,
  padding: '0 8px',
  pointerEvents: 'none',
  borderRadius: theme.shape.borderRadius + 'px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'}`,
  overflow: 'hidden',
  transition: 'border-color 0.2s',

  '& legend': {
    display: 'block',
    visibility: 'hidden',
    maxWidth: '0',
    height: '11px',
    fontSize: '12px',
    padding: 0,
    whiteSpace: 'nowrap',
    transition: 'max-width 0.1s ease',

    '&.expanded': {
      maxWidth: '100%',
      padding: '0 4px',
    },
  },
}));

interface ItemProps extends ReturnType<AutocompleteGetItemProps<true>> {
  label: string;
}

function Item(props: ItemProps) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

const StyledItem = styled(Item)<ItemProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '24px',
  lineHeight: '24px',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.08)'
    : theme.palette.grey[100],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius + 'px',
  boxSizing: 'content-box',
  padding: '0 4px 0 10px',
  outline: 0,
  overflow: 'hidden',

  '&:focus': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(25,118,210,0.15)'
      : theme.palette.primary.light + '33',
  },
  '& span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: '13px',
  },
  '& svg': {
    fontSize: '14px',
    cursor: 'pointer',
    padding: '4px',
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
}));

const Listbox = styled('ul')(({ theme }) => ({
  width: '100%',
  margin: '4px 0 0',
  padding: '4px 0',
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: theme.palette.background.paper,
  overflow: 'auto',
  maxHeight: '250px',
  borderRadius: theme.shape.borderRadius + 'px',
  boxShadow: theme.shadows[4],
  zIndex: theme.zIndex.modal,
  boxSizing: 'border-box',

  '& li': {
    padding: '6px 16px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    fontFamily: theme.typography.fontFamily,
    '& span': {
      flexGrow: 1,
    },
    '& svg': {
      color: 'transparent',
    },
  },
  "& li[aria-selected='true']": {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(25,118,210,0.2)'
      : theme.palette.primary.light + '22',
    fontWeight: 600,
    '& svg': {
      color: theme.palette.primary.main,
    },
  },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
    '& svg': {
      color: theme.palette.text.secondary,
    },
  },
}));

export default function MultipleAutoComplete<Value>(
  props: UseAutocompleteProps<Value, true, false, false>,
) {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getItemProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    multiple: true,
    ...props,
  });

  return (
    <FormControl sx={{ m: 1, width: "90%" }}>
      <div {...getRootProps()}>
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          <StyledFieldset>
            <legend className={focused || value.length > 0 ? 'expanded' : ''}>
              Names
            </legend>
          </StyledFieldset>
          <Label {...getInputLabelProps()} className={focused || value.length > 0 ? 'shrink' : ''}>
            Names
          </Label>
          {value.map((option, index) => {
            const { key, ...itemProps } = getItemProps({ index });
            return (
              <StyledItem
                key={key}
                {...itemProps}
                label={props.getOptionLabel!(option)}
              />
            );
          })}
          <input {...getInputProps()} />
        </InputWrapper>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => {
              const { key, ...optionProps } = getOptionProps({ option, index });
              return (
                <li key={key} {...optionProps}>
                  <span>{props.getOptionLabel!(option)}</span>
                  <CheckIcon fontSize="small" />
                </li>
              );
            })}
          </Listbox>
        ) : null}
      </div>
    </FormControl>
  );
}