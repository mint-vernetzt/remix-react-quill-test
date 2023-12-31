import {
  json,
  type ActionArgs,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node";
import RTE from "~/components/RTE.client";
import { ClientOnly } from "remix-utils";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import React from "react";
import type ReactQuill from "react-quill";
import sanitizeHtml from "sanitize-html";
import { ensureFile, readJson, writeJson } from "fs-extra";

const contentPath = "./tmp/content.json";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const sanitizerOptions = {
  allowedTags: [
    "p",
    "b",
    "strong",
    "i",
    "em",
    "u",
    "a",
    "br",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  transformTags: {
    a: (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      };
    },
  },
} as sanitizeHtml.IOptions;

export const loader = async (args: LoaderArgs) => {
  try {
    await ensureFile(contentPath);
    console.log("content file exists");
  } catch (error) {
    console.log({ error });
  }
  let content = null;
  try {
    content = await readJson(contentPath);
    console.log("content read");
  } catch (error) {
    console.log({ error });
  }
  if (content === null) {
    content = {
      text: null,
      textRTE: null,
    };
  }
  return json(content as { text: string | null; textRTE: string | null });
};

export const action = async (args: ActionArgs) => {
  const { request } = args;

  await ensureFile(contentPath);

  const clone = request.clone();

  const formData = await clone.formData();
  const text = formData.get("text");
  const textRTE = formData.get("textRTE");

  const sanitizedText = sanitizeHtml(textRTE as string, sanitizerOptions);

  try {
    await writeJson(contentPath, { text, textRTE: sanitizedText });
    console.log("content written");
  } catch (error) {
    console.log({ error });
  }
  return json({ text, textRTE });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const editorRef = React.useRef<ReactQuill>(null);
  const submit = useSubmit();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editorRef.current !== null) {
      const editor = editorRef.current.getEditor();

      const form = event.currentTarget;
      const formData = new FormData(form);
      formData.set("text", editor.getText());

      const sanitizedText = sanitizeHtml(
        editor.root.innerHTML as string,
        sanitizerOptions
      );
      formData.set("textRTE", sanitizedText);

      submit(formData, { method: "post" });
    }
  };

  const content = sanitizeHtml(
    loaderData.textRTE || loaderData.text || "",
    sanitizerOptions
  );

  return (
    <>
      <h1>
        <u>Editor</u>
      </h1>
      <Form onSubmit={handleSubmit}>
        <ClientOnly>
          {() => <RTE ref={editorRef} defaultValue={content} />}
        </ClientOnly>
        <button type="submit">Submit</button>
      </Form>
      <hr />
      <h1>
        <u>Preview</u>
      </h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}
