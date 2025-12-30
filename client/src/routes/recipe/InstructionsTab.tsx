import { Recipe } from "../../types/recipeTypes.ts";

type Props = {
  notes: Recipe["notes"];
  instructions: Recipe["instructions"];
};

function InstructionsTab({ notes, instructions }: Props) {
  if (instructions === undefined && notes === undefined) {
    return (
      <div role="tabpanel" className="recipePageTabPanel">
        <p>This recipe has no instructions, good luck! 👍</p>
      </div>
    );
  }
  return (
    <div role="tabpanel" className="recipePageTabPanel">
      {notes &&
        <Notes notes={notes} />}
      {instructions && <Instructions instructions={instructions} />}
    </div>
  );
}

type NoteProps = { notes: string };

function Notes({ notes }: NoteProps) {
  return (
    <section aria-details="recipe notes" className="notes">
      {notes}
    </section>
  );
}

type InstructionsProps = { instructions: string };

function Instructions({ instructions }: InstructionsProps) {
  return (
    <section aria-details="recipe instructions" className="instructions">
      <h2 className="h2">Method</h2>
      <ol>
        {instructions.split("\n")
          .map((line, i) => (
            <li key={i} className="instruction">
              <span className="instructionMarker">{i + 1}.</span>
              <span>{line}</span>
            </li>
          ))}
      </ol>
    </section>
  );
}

export default InstructionsTab;
