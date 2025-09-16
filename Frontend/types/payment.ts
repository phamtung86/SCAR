import { CarDTO } from "./car";
import { FeeDTO } from "./fee";
import { UserDTO } from "./user";

export type PaymentDTO = {
  id: number;
  description: string;
  amount: number;
  paymentType: "VNPAY" | "MOMO" | "BANKING"; 
  status: "PENDING" | "ERROR" | "SUCCESS" | "CANCELED"; 
  orderType: "POST_FEE" | "UPGRADE_ACCOUNT" | "OTHER";
  user: UserDTO;
  car: CarDTO;
  merchantTxnRef: string;
  gatewayTransactionId: string;
  createdAt: string; 
  updatedAt: string; 
  expiryDate: string;
  fee : FeeDTO
};