"use client";

import { AIMessageComponent } from "@/components/message";
import { DocumentInterface } from "@langchain/core/documents";

export const DocumentLoading = () => (
  <AIMessageComponent>
    <div className="container mt-4">
      <div className="card" style={{ width: "800px" }}>
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <div className="placeholder-glow flex-grow-1">
              <span
                className="placeholder col-8"
                style={{ height: "25px", backgroundColor: "#ccc" }}
              ></span>
            </div>
          </div>
          <p className="placeholder-glow mt-2">
            <span
              className="placeholder col-10"
              style={{ height: "15px", backgroundColor: "#ccc" }}
            ></span>
            <span
              className="placeholder col-6"
              style={{ height: "15px", backgroundColor: "#ccc" }}
            ></span>
          </p>
          <p className="placeholder-glow mt-2">
            <span
              className="placeholder col-12"
              style={{ height: "15px", backgroundColor: "#ccc" }}
            ></span>
          </p>
        </div>
      </div>
    </div>
  </AIMessageComponent>
);

export const Document = (documents: DocumentInterface[]) => (
  <AIMessageComponent>
    <div className="container">
      <div className="row">
        {Object.values(documents).map((doc, index) => (
          <div key={index} className="col-md-12 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">{doc.metadata.title}</h5>
                <p className="card-text">{doc.pageContent}</p>
              </div>
              <div className="card-footer">
                <small>
                  <a
                    href={doc.metadata.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </AIMessageComponent>
);
