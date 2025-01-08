import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { PropertyData } from "src/utils/domainSchemas";

@WebSocketGateway()
export class SupabaseGateway {
    @WebSocketServer()
    wsServer: Server;

    @SubscribeMessage('properties-subscribe')
    propertiesSubscribe(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        client.data.propertiesFilter = data;
    }

    @SubscribeMessage('properties-unsubscribe')
    propertiesUnsubscribe(
        @ConnectedSocket() client: Socket,
    ) {
        client.data.propertiesFilter = undefined;
    }

    notifyCreatedProperty(newProperty: PropertyData) {
        this.wsServer.sockets.sockets.forEach((client: Socket) => {
            //if newProperty complies client.data.propertiesFilter, send event
            client.emit('new-property', newProperty); 
        })
    }

    notifyUpdatedProperty(updatedProperty: PropertyData) {
        this.wsServer.sockets.sockets.forEach((client: Socket) => {
            //if updatedProperty complies client.data.propertiesFilter, send event
            client.emit('updated-property', updatedProperty);
        })
    }
}