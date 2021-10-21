import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Modal: FC<Props> = ({ children }) => (
  <div
    style={{
      width: "500px",
      height: "500px",
      backgroundColor: "lightgrey",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
    }}
  >
    <div style={{ width: "100%", padding: "20px" }}>{children}</div>
  </div>
);

export const Wrapper: FC<Props> = ({ children }) => (
  <div
    id="wrapper"
    style={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Modal>{children}</Modal>
  </div>
);
