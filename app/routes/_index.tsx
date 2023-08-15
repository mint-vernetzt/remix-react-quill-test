import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import RTE from "~/components/RTE.client";
import { ClientOnly } from "remix-utils";
import { Form, useSubmit } from "@remix-run/react";
import React from "react";
import type ReactQuill from "react-quill";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async (args: ActionArgs) => {
  const { request } = args;

  const clone = request.clone();

  const formData = await clone.formData();
  const text = formData.get("text");
  const textRTE = formData.get("textRTE");

  console.log({ text, textRTE });
  return null;
};

export default function Index() {
  const editorRef = React.useRef<ReactQuill>(null);
  const submit = useSubmit();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editorRef.current !== null) {
      const editor = editorRef.current.getEditor();

      const form = event.currentTarget;
      const formData = new FormData(form);
      formData.set("text", editor.getText());
      formData.set("textRTE", editor.root.innerHTML);
      submit(formData, { method: "post" });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ClientOnly>{() => <RTE editorRef={editorRef} />}</ClientOnly>
      <button type="submit">Submit</button>
    </Form>
  );
}
