import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MarketPrice } from './market-price';
import { Subject, from } from 'rxjs';
import * as socketio from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MarketStatusService {

  private baseUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  getInitialMarketStatus() {
    return this.httpClient.get<MarketPrice[]>(this.baseUrl + '/api/market');
  }


  getUpdates(){
    // Creates a manager for the Socket.IO endpoint at the given URL
    let socket = socketio(this.baseUrl);
    // Creates a RxJS Subject and gets an Observable from this subject. This
    // observable is returned from this method so consumers can listen to the updates.
    let marketSub = new Subject<MarketPrice>();
    let marketSubObservable = from(marketSub);

    // The call to the on method on the Socket.IO manager adds a listener to the market event.
    // The callback passed to this method is called whenever the Socket.IO endpoint publishes 
    // something new.
    socket.on('market', (marketStatus: MarketPrice) => {
      marketSub.next(marketStatus);
    });

    return marketSubObservable;
  }

}
