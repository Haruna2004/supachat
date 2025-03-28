export interface GupshupMessagePayload {
  app: string;
  timestamp: number;
  version: number;
  type: string;
  payload: {
    id: string;
    source: string;
    type: string;
    payload: {
      text: string;
    };
    sender: {
      phone: string;
      name: string;
      country_code: string;
      dial_code: string;
    };
  };
}
