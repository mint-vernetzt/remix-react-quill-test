import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function RTE() {
  const limit = 100;

  const [value, setValue] = React.useState("");
  const [length, setLength] = React.useState(0);
  const ref = React.useRef<ReactQuill | null>(null);

  React.useEffect(() => {
    if (ref !== null && ref.current !== null) {
      const editor = ref.current.getEditor();
      const handleTextChange = () => {
        const newLength = editor.getLength() - 1;

        if (newLength > limit) {
          editor.deleteText(limit, newLength);
        }
        setLength(newLength);
      };
      editor.on("text-change", handleTextChange);
    }
  }, [ref]);
  return (
    <>
      <ReactQuill theme="snow" value={value} onChange={setValue} ref={ref} />
      <p>
        {length}/{limit} Characters
      </p>
    </>
  );
}

export default RTE;
