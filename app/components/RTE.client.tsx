import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export type RTEProps = {
  editorRef: React.MutableRefObject<ReactQuill | null>;
  defaultValue: string;
};

function RTE(props: RTEProps) {
  const { editorRef } = props;

  const limit = 100;

  const toolbar = "toolbar_id";

  const [value, setValue] = React.useState(props.defaultValue);
  const [length, setLength] = React.useState(0);

  React.useEffect(() => {
    if (editorRef !== null && editorRef.current !== null) {
      const editor = editorRef.current.getEditor();
      const handleTextChange = () => {
        const newLength = editor.getLength() - 1;

        if (newLength > limit) {
          editor.deleteText(limit, newLength);
        }
        setLength(newLength);
      };
      editor.on("text-change", handleTextChange);
    }
  }, [editorRef]);

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
        ref={props.editorRef}
        modules={{ toolbar: `#${toolbar}` }}
      />
      <p>
        {length}/{limit} Characters
      </p>
    </>
  );
}

export default RTE;
