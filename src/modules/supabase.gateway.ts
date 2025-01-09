import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { PersonData, PropertyData, RealtorData } from "src/utils/domainSchemas";

@WebSocketGateway()
export class SupabaseGateway {
    @WebSocketServer()
    wsServer: Server;

    @SubscribeMessage('properties-subscribe')
    propertiesSubscribe(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        console.log(`supabaseGatway -> properties-subscribe ${client.id}`);
        client.data.propertiesFilter = data;
    }

    @SubscribeMessage('properties-unsubscribe')
    propertiesUnsubscribe(
        @ConnectedSocket() client: Socket,
    ) {
        console.log(`supabaseGatway -> properties-unsubscribe ${client.id}`);
        client.data.propertiesFilter = undefined;
    }

    @SubscribeMessage('realtors-subscribe')
    realtorsSubscribe(
      @MessageBody() data: any,
      @ConnectedSocket() client: Socket,
    ) {
      console.log(`supabaseGatway -> realtors-subscribe ${client.id}`);
      client.data.realtorsFilter = data;
    }

    @SubscribeMessage('realtors-unsubscribe')
    realtorUnsubscribe(
      @ConnectedSocket() client: Socket,
    ) {
      console.log(`supabaseGatway -> realtors-unsubscribe ${client.id}`);
      client.data.realtorsFilter = undefined;
    }

    @SubscribeMessage('persons-subscribe')
    personsSubscribe(
      @MessageBody() data: any,
      @ConnectedSocket() client: Socket,
    ) {
      console.log(`supabaseGatway -> persons-subscribe ${client.id}`);
      client.data.personsFilter = data;
    }

    @SubscribeMessage('persons-unsubscribe')
    personsUnsubscribe(
      @ConnectedSocket() client: Socket,
    ) {
      console.log(`supabaseGatway -> persons-unsubscribe ${client.id}`);
      client.data.personsFilter = undefined;
    }

    notifyCreatedProperty(newProperty: PropertyData) {
        console.log(`supabaseGateway -> notifyCreatedProperty ${newProperty.id}`);

        this.wsServer.sockets.sockets.forEach((client: Socket) => {
            //if newProperty complies client.data.propertiesFilter, send event
            client.emit('new-property', newProperty); 
        })
    }

    notifyUpdatedProperty(updatedProperty: PropertyData) { 
        console.log(`supabaseGateway -> notifyUpdatedProperty ${updatedProperty.id}`);

        this.wsServer.sockets.sockets.forEach((client: Socket) => {
            //if updatedProperty complies client.data.propertiesFilter, send event
            client.emit('updated-property', updatedProperty);
        })
    }

    notifyCreatedRealtor(newRealtor: RealtorData) {
      console.log(`supabaseGateway -> notifyCreatedRealtor ${newRealtor.id}`);

      this.wsServer.sockets.sockets.forEach((client: Socket) => {
        //if applies based on personsFilter
        client.emit('new-realtor', newRealtor);
      })
    }

    notifyUpdatedRealtor(updatedRealtor: RealtorData) { 
      console.log(`supabaseGateway -> notifyUpdatedRealtor ${updatedRealtor.id}`);

      this.wsServer.sockets.sockets.forEach((client: Socket) => {
        //if applies based on filter
        client.emit('updated-realtor', updatedRealtor);
      })
    }

    notifyCreatedPerson(newPerson: PersonData) {
      console.log(`supabaseGateway -> notifyCreatedPerson ${newPerson.id}`);

      this.wsServer.sockets.sockets.forEach((client: Socket) => {
        //if applies based on filter
        client.emit('created-person', newPerson);
      })
    }

    notifyUpdatedPerson(updatedPerson: PersonData) {
      console.log(`supabaseGateway -> notifyUpdatedPerson ${updatedPerson.id}`);

      this.wsServer.sockets.sockets.forEach((client: Socket) => {
        //if applies based on filter
        client.emit('updated-person', updatedPerson);
      })
    }
}
