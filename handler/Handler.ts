import { Ticket } from "../models/Ticket";

export abstract class Handler {
  private successor: Handler | null = null;

  setSuccessor(successor: Handler): void {
    this.successor = successor;
  }

  abstract handleRequest(ticket: Ticket): void;

  protected nextHandler(ticket: Ticket): void {
    if (this.successor) {
      this.successor.handleRequest(ticket);
    } else {
      console.log("No hay más manejadores disponibles para este ticket.");
    }
  }
}
// canbios