"use client";

import { AIMessageComponent } from "@/components/message";

export const SearchLoading = () => (
  <AIMessageComponent>
    <div className="d-flex justify-content-center">
      <div className="spinner-border text-muted" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  </AIMessageComponent>
);
