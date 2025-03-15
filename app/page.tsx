"use client";

import { useState, useRef, useEffect } from "react";
import { useActions } from "ai/rsc";
import { HumanMessageText } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";

const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });

export default function Home() {
  const { sendMessage } = useActions();

  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  useEffect(() => inputRef.current?.focus(), []);

  async function onSubmit(prompt: string) {
    if (!prompt) return;

    const newElements = [...elements];
    let base64File: string | undefined = undefined;

    if (selectedFile) {
      base64File = await convertFileToBase64(selectedFile);
    }

    const element = await sendMessage({
      prompt,
      file: base64File
        ? {
            base64: base64File,
          }
        : undefined,
    });
    newElements.push(
      <div>
        {element.url && (
          <img
            src={element.url}
            alt="image"
            style={{ maxWidth: "800px" }}
            className="pb-2 h-auto"
          />
        )}
        <HumanMessageText content={input} />
        {element.ui}
      </div>,
    );

    setElements(newElements);
    setInput("");
    setSelectedFile(undefined);
  }

  return (
    <section>
      <div className="py-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">Chat</h5>
                <button type="button" className="btn btn-primary btn-sm">
                  Let's Chat App
                </button>
              </div>

              <div
                ref={messagesContainerRef}
                className="card-body overflow-y-scroll"
                style={{ position: "relative", height: "600px" }}
              >
                <div className="divider d-flex align-items-center mb-4">
                  <div
                    className="text-center mx-3 mb-0"
                    style={{ color: "#a2aab7" }}
                  >
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </div>
                </div>
                {elements}
                <div ref={messagesEndRef} />
              </div>
              <form
                ref={formRef}
                onSubmit={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  await onSubmit(input);
                }}
              >
                <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                    alt="avatar 3"
                    style={{ width: "40px", height: "100%" }}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    className="form-control form-control-lg border-0"
                    placeholder="Type message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="d-none"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <a
                    className="ms-1 text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={(_) => fileInputRef.current?.click()}
                  >
                    <i className="fas fa-paperclip" title="File Upload"></i>
                  </a>
                  <a
                    className="ms-3"
                    style={{ cursor: "pointer" }}
                    onClick={(_) => formRef.current?.requestSubmit()}
                  >
                    <i className="fas fa-paper-plane" title="Send"></i>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
