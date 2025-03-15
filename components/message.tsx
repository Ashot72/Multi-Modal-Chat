import { ReactNode } from "react";

export interface MessageTextProps {
  content: string;
}

export function AIMessageComponent({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex flex-row justify-content-end mb-4 pt-1">
      <div>
        <p className="small p-2 me-3 mb-1 text-white rounded-3">{children}</p>
        <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
          {new Date().toLocaleTimeString()}
        </p>
      </div>
      <img
        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
        alt="avatar bot"
        style={{ width: "45px", height: "100%" }}
      />
    </div>
  );
}

export function AIMessageText(props: MessageTextProps) {
  return (
    <div className="d-flex flex-row justify-content-end mb-4 pt-1">
      <div>
        <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
          {
            <span
              dangerouslySetInnerHTML={{
                __html: props.content.replace(/\n/g, "<br />"),
              }}
            />
          }
        </p>
        <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
          {new Date().toLocaleTimeString()}
        </p>
      </div>
      <img
        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
        alt="avatar bot"
        style={{ width: "45px", height: "100%" }}
      />
    </div>
  );
}

export function HumanMessageText(props: MessageTextProps) {
  return (
    <div className="d-flex flex-row justify-content-start mb-4">
      <img
        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
        alt="avatar user"
        style={{ width: "45px", height: "100%" }}
      />
      <div>
        <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">
          {props.content}
        </p>
        <p className="small ms-3 mb-3 rounded-3 text-muted">
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
