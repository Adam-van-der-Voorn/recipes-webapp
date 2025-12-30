import {
  Control,
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
  useFormState,
  UseFormTrigger,
  useWatch,
} from "react-hook-form";
import React, { ClipboardEventHandler } from "react";
import { MdMoreVert } from "react-icons/md";
import MenuItemToggleable from "../../../general/dropdown/MenuItemToggleable.tsx";
import DropdownMenu from "../../../general/dropdown/DropdownMenu.tsx";
import MenuItemAction from "../../../general/dropdown/MenuItemAction.tsx";
import FormErrorMessage from "../FormErrorMessage.tsx";
import PercentageInput from "./PercentageInput.tsx";
import {
  RecipeInput,
  SubstitutionInput,
} from "../../../types/RecipeInputTypes.ts";
import useFieldList from "../../../util/hooks/useFieldList.ts";
import { v4 as uuid4 } from "uuid";
import Dialog from "../../../general/Dialog.tsx";
import useModal from "../../../util/hooks/useModal.tsx";
import AddSubstitution from "../substitutions/AddSubstitution.tsx";
import { parseExternalIngredientText } from "../../parse-external/parseExternalIngredientText.ts";
import { RECIPE_FORM_INPUT_REASONABLE_LEN } from "../RecipeForm.tsx";

const decimalValPattern = /^\d+(\.\d+)?$/;
const defaultFieldValues = {
  name: "",
  optional: false,
  percentage: "",
  quantity: "",
};

type FormHelpers = {
  control: Control<RecipeInput, any>;
  setValue: UseFormSetValue<RecipeInput>;
  register: UseFormRegister<RecipeInput>;
  trigger: UseFormTrigger<RecipeInput>;
};

type FakeTag = {
  isFake?: boolean;
};

type Props = {
  listIdx: number;
  listPos: number;
  isPercentagesIncluded: boolean;
  isNamed: boolean;
  onPercentageBlur: (subListIdx: number, localIdx: number) => (e: any) => void;
  onQuantityBlur: (subListIdx: number, localIdx: number) => (e: any) => void;
  onAnchorChange: (newAnchorIdx: number) => void;
} & FormHelpers;

function IngredientsSubField(
  {
    listIdx,
    listPos,
    isPercentagesIncluded,
    isNamed,
    onPercentageBlur,
    onQuantityBlur,
    onAnchorChange,
    ...formHelpers
  }: Props,
) {
  const { control, setValue, register, trigger } = formHelpers;

  const [ingredients, substitutions, currentAnchorIdx] = useWatch({
    control,
    name: [
      `ingredients.lists.${listIdx}.ingredients`,
      `substitutions`,
      `ingredients.anchor`,
    ],
  });

  const { push, remove } = useFieldList(
    `ingredients.lists.${listIdx}.ingredients`,
    setValue,
    ingredients,
  );
  const { push: addSubstitution } = useFieldList(
    `substitutions`,
    setValue,
    substitutions,
  );

  const { errors } = useFormState({ control });

  // include fakeTag to ingredints type
  const rows = [...ingredients] as Array<(typeof ingredients[0]) & FakeTag>;

  const lastIngredient = ingredients[ingredients.length - 1];
  if (!lastIngredient || (lastIngredient.name !== "")) {
    // last field is not 'empty'
    // push a "fake" field for the user to input the next ingredient
    rows.push({ ...defaultFieldValues, id: uuid4(), isFake: true });
  }

  const { openModal: openDialogue, modal: dialogue } = useModal<
    string,
    SubstitutionInput
  >(({ ...renderProps }) => (
    <Dialog
      open={true}
      onClose={() => renderProps.cancel()}
      closeOnBackgroudClick
    >
      <AddSubstitution {...renderProps} />
    </Dialog>
  ));

  const handleNewSubstitution = (result: SubstitutionInput) => {
    addSubstitution(result);
  };

  const onPaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
    const input = event.target as HTMLInputElement;
    if (input.value.trim() !== "") {
      // just regular paste if input contains content
      return;
    }
    const clip: DataTransfer = event.clipboardData ||
      (window as any).clipboardData;
    const pastedText = clip.getData("text");
    const parsed = parseExternalIngredientText(pastedText);
    if (parsed.length === 0) {
      // fallback to normal paste if we cannot parse anything out
      return;
    }

    event.preventDefault();

    const inputIndex = getIngredientRowIndex(input);
    let nextIngredient = parsed.shift();
    let ingredientsCopy = [...ingredients];
    let i = inputIndex;
    while (nextIngredient !== undefined) {
      const row = {
        ...defaultFieldValues,
        name: nextIngredient.ingredient,
        quantity: nextIngredient.quantity ?? "",
        id: uuid4(),
      };
      const isEmpty = !ingredientsCopy[i] ||
        ingredientsCopy[i].name.trim().length === 0;
      if (isEmpty) {
        ingredientsCopy[i] = row;
      } else {
        // insert
        const ii = i;
        ingredientsCopy = [
          ...ingredientsCopy.slice(0, ii),
          row,
          ...ingredientsCopy.slice(ii),
        ];
      }
      nextIngredient = parsed.shift();
      i++;
    }
    setValue(`ingredients.lists.${listIdx}.ingredients`, ingredientsCopy);
    trigger(`ingredients.lists.${listIdx}.ingredients`);
  };

  function getIngredientRowIndex(input: HTMLInputElement) {
    if (input.name === "add-new") {
      return ingredients.length;
    }
    // ingredients.lists.0.ingredients.0.name
    const inputIndexStr = input.name.split(".")?.at(4);
    if (inputIndexStr) {
      let parsed = parseInt(inputIndexStr);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }

    console.warn(
      "PasteIngredients: failed to get input index, this indicates a bug. Falling back to 0",
    );
    return 0;
  }

  const ingredientListClass = isPercentagesIncluded
    ? `ingredientFormList showPercentages`
    : `ingredientFormList`;

  const ingredientListNameValidation = {
    maxLength: {
      value: RECIPE_FORM_INPUT_REASONABLE_LEN,
      message: "List name is far too long",
    },
  };
  const ingredientNameValidation = {
    required: { value: true, message: "Ingredient name is required" },
    maxLength: {
      value: RECIPE_FORM_INPUT_REASONABLE_LEN,
      message: "Ingredient name is far too long",
    },
  };
  const ingredientQuantityValidation = {
    maxLength: {
      value: RECIPE_FORM_INPUT_REASONABLE_LEN,
      message: "Ingredient quantity is far too long",
    },
  };
  const ingredientPercentageValidation = {
    validate: (val: string) => {
      return val === "" || decimalValPattern.test(val)
        ? true
        : "Proportion must be a percentage";
    },
  };

  return (
    <>
      {dialogue}
      {isNamed &&
        (
          <div>
            <input
              {...register(
                `ingredients.lists.${listIdx}.name`,
                ingredientListNameValidation,
              )}
              type="text"
              className="subIngredientsName"
              placeholder="Untitled List"
              autoComplete="off"
            />
            <FormErrorMessage
              error={errors.ingredients?.lists?.[listIdx]?.name}
            />
          </div>
        )}
      <div className={ingredientListClass}>
        <div className="ingredientListLabel">Ingredient</div>
        <div className="ingredientListLabel">Quantity</div>
        {isPercentagesIncluded && (
          <div className="ingredientListLabel">Proportion</div>
        )}
        <div></div> {/* grid filler for inline button menu */}

        {rows.map((ingredient, localIdx) => {
          const globalIdx = listPos + localIdx;
          const isAnchor = globalIdx === currentAnchorIdx;
          const listErrors = errors.ingredients?.lists?.[listIdx]?.ingredients
            ?.[localIdx];
          if (ingredient.isFake) {
            // fragment is needed so that one the user types and this input is replaced by
            // a registered input, focused is kept and user can keep typing
            return (
              <React.Fragment key={ingredient.id}>
                <input
                  name="add-new"
                  onChange={(ev) =>
                    push({
                      id: ingredient.id,
                      ...defaultFieldValues,
                      name: ev.target.value,
                    })}
                  onPaste={onPaste}
                  type="text"
                  className="name new-ingredient"
                  autoComplete="off"
                  placeholder="Add new ingredient"
                  aria-label="new ingredient name"
                  aria-details="Used to add a new ingredient. Other fields will be added once a name is typed."
                />
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={ingredient.id}>
              <input
                {...register(
                  `ingredients.lists.${listIdx}.ingredients.${localIdx}.name`,
                  ingredientNameValidation,
                )}
                type="text"
                onPaste={onPaste}
                className="name"
                autoComplete="off"
                aria-label="ingredient name"
              />
              <input
                {...register(
                  `ingredients.lists.${listIdx}.ingredients.${localIdx}.quantity`,
                  {
                    onBlur: onQuantityBlur(listIdx, localIdx),
                    ...ingredientQuantityValidation,
                  },
                )}
                type="text"
                className="quantity"
                autoComplete="off"
                aria-label="ingredient quantity"
              />

              {isPercentagesIncluded &&
                (
                  <PercentageInput
                    {...register(
                      `ingredients.lists.${listIdx}.ingredients.${localIdx}.percentage`,
                      {
                        onBlur: onPercentageBlur(listIdx, localIdx),
                        ...ingredientPercentageValidation,
                      },
                    )}
                    isAnchor={isAnchor}
                  />
                )}

              <DropdownMenu
                trigger={
                  <span>
                    <MdMoreVert
                      className={`ingredientMenu icon-button`}
                      tabIndex={0}
                    />
                  </span>
                }
                position={"left top"}
                offset={["-0.8rem", "0rem"]}
              >
                <MenuItemToggleable
                  text="Optional"
                  value={ingredient.optional}
                  toggle={(b) =>
                    setValue(
                      `ingredients.lists.${listIdx}.ingredients.${localIdx}.optional`,
                      b,
                    )}
                />
                {!isAnchor && isPercentagesIncluded &&
                  (
                    <MenuItemAction
                      text="Set to anchor"
                      action={() => onAnchorChange(globalIdx)}
                    />
                  )}
                <MenuItemAction text="Delete" action={() => remove(localIdx)} />
                <MenuItemAction
                  text="Provide substitution"
                  action={() =>
                    openDialogue({
                      input: ingredient.name,
                      onClose: handleNewSubstitution,
                    })}
                />
              </DropdownMenu>

              <div className="ingredientErrors">
                <FormErrorMessage error={listErrors?.name} />
                <FormErrorMessage error={listErrors?.quantity} />
                <FormErrorMessage error={listErrors?.percentage} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}

export default IngredientsSubField;
