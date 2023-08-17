import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export type RTEProps = {
  defaultValue: string;
  children?: React.ReactNode;
  maxLength?: number;
};

const RTE = React.forwardRef<ReactQuill, RTEProps>((props, ref) => {
  const { maxLength = 2000 } = props;

  const toolbar = "toolbar_id";

  const [value, setValue] = React.useState(props.defaultValue);
  const [length, setLength] = React.useState(0);

  React.useEffect(() => {
    if (ref !== null && ref.current !== null) {
      const editor = ref.current.getEditor();
      const handleTextChange = () => {
        const newLength = editor.getLength() - 1;

        if (newLength > maxLength) {
          editor.deleteText(maxLength, newLength);
        }
        setLength(newLength);
      };
      editor.on("text-change", handleTextChange);
    }
  }, [ref]);

  return (
    <>
      <div id={`${toolbar}`}>
        <div className="ql-formats">
          <select className="ql-header">
            <option value="2">Überschrift 1</option>
            <option value="3">Überschrift 2</option>
            <option value="4">Überschrift 3</option>
            <option value="" selected>
              Text
            </option>
          </select>
        </div>
        <div className="ql-formats">
          <button className="ql-bold">fett</button>
          <button className="ql-italic">kursiv</button>
          <button className="ql-underline">unterstrichen</button>
        </div>
        <div className="ql-formats">
          <button type="button" className="ql-list" value="ordered">
            nummerierte Liste
          </button>
          <button type="button" className="ql-list" value="bullet">
            unnummerierte Liste
          </button>
        </div>
        <div className="ql-formats">
          <button type="button" className="ql-link">
            Link
          </button>
        </div>
        <div className="ql-formats">
          <button className="ql-clean">Format entfernen</button>
        </div>
      </div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        ref={ref}
        modules={{
          toolbar: `#${toolbar}`,
          clipboard: {
            matchVisual: false,
          },
        }}
      />
      <p>
        {length}/{maxLength} Characters
      </p>
    </>
  );
});
RTE.displayName = "RTE";

export default RTE;
