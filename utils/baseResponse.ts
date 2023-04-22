export interface BaseResponse {
  statusCode: number;
  status: "success" | "error";
  message: string;
  errorCode?: string;
  [key: string]: any;
}

export interface BaseErrorResponse extends BaseResponse {
  status: "error";
  errorCode: string;
}

export interface BaseSuccessResponse extends BaseResponse {
  status: "success";
  errorCode: undefined;
}

export const isSuccessResponse = (response: BaseResponse): response is BaseSuccessResponse => {
  return (
    response.status === "success" ||
    (response.statusCode !== undefined && response.statusCode.toString().startsWith("2"))
  );
};

export const isFailedResponse = (response: BaseResponse): response is BaseErrorResponse => {
  return (
    response.status === "error" ||
    (response.statusCode !== undefined && !response.statusCode.toString().startsWith("2"))
  );
};
