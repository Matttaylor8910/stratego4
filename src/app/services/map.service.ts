import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import {Map, Piece} from 'types';

@Injectable({providedIn: 'root'})
export class MapService {
  constructor(
      private readonly afs: AngularFirestore,
  ) {}

  createMap(map: Map): Promise<DocumentReference> {
    return this.afs.collection('maps').add(map);
  }

  // don't call this ever again
  createDefaultMap() {
    const map = {
      name: 'Default',
      width: 13,
      height: 13,
      players: [
        {
          // red
          color: '#EECDCD',
          coordinates: {
            '0,4': '',
            '0,5': '',
            '0,6': '',
            '0,7': '',
            '0,8': '',
            '1,4': '',
            '1,5': '',
            '1,6': '',
            '1,7': '',
            '1,8': '',
            '2,4': '',
            '2,5': '',
            '2,6': '',
            '2,7': '',
            '2,8': '',
            '3,5': '',
            '3,6': '',
            '3,7': '',
          }
        },
        {
          // blue
          color: '#CCDAF5',
          coordinates: {
            '4,0': '',
            '4,1': '',
            '4,2': '',
            '5,0': '',
            '5,1': '',
            '5,2': '',
            '5,3': '',
            '6,0': '',
            '6,1': '',
            '6,2': '',
            '6,3': '',
            '7,0': '',
            '7,1': '',
            '7,2': '',
            '7,3': '',
            '8,0': '',
            '8,1': '',
            '8,2': '',
          }
        },
        {
          // green
          color: '#DCE9D5',
          coordinates: {
            '4,10': '',
            '4,11': '',
            '4,12': '',
            '5,9': '',
            '5,10': '',
            '5,11': '',
            '5,12': '',
            '6,9': '',
            '6,10': '',
            '6,11': '',
            '6,12': '',
            '7,9': '',
            '7,10': '',
            '7,11': '',
            '7,12': '',
            '8,10': '',
            '8,11': '',
            '8,12': '',
          }
        },
        {
          // yellow
          color: '#FDF2D0',
          coordinates: {
            '9,5': '',
            '9,6': '',
            '9,7': '',
            '10,4': '',
            '10,5': '',
            '10,6': '',
            '10,7': '',
            '10,8': '',
            '11,4': '',
            '11,5': '',
            '11,6': '',
            '11,7': '',
            '11,8': '',
            '12,4': '',
            '12,5': '',
            '12,6': '',
            '12,7': '',
            '12,8': '',
          }
        },
      ],
      pieces: {
        [Piece.FLAG]: 1,
        [Piece.BOMB]: 2,
        [Piece.SPY]: 1,
        [Piece.GENERAL]: 1,
        [Piece.SIX]: 1,
        [Piece.FIVE]: 2,
        [Piece.FOUR]: 3,
        [Piece.THREE]: 3,
        [Piece.TWO]: 4,
      },
      offLimits: {
        // top left
        '0,0': '',
        '0,1': '',
        '0,2': '',
        '0,3': '',
        '1,0': '',
        '1,1': '',
        '1,2': '',
        '1,3': '',
        '2,0': '',
        '2,1': '',
        '2,2': '',
        '2,3': '',
        '3,0': '',
        '3,1': '',
        '3,2': '',
        // top right
        '0,9': '',
        '0,10': '',
        '0,11': '',
        '0,12': '',
        '1,9': '',
        '1,10': '',
        '1,11': '',
        '1,12': '',
        '2,9': '',
        '2,10': '',
        '2,11': '',
        '2,12': '',
        '3,10': '',
        '3,11': '',
        '3,12': '',
        // bottom left
        '9,0': '',
        '9,1': '',
        '9,2': '',
        '10,0': '',
        '10,1': '',
        '10,2': '',
        '10,3': '',
        '11,0': '',
        '11,1': '',
        '11,2': '',
        '11,3': '',
        '12,0': '',
        '12,1': '',
        '12,2': '',
        '12,3': '',
        // bottom right
        '9,10': '',
        '9,11': '',
        '9,12': '',
        '10,9': '',
        '10,10': '',
        '10,11': '',
        '10,12': '',
        '11,9': '',
        '11,10': '',
        '11,11': '',
        '11,12': '',
        '12,9': '',
        '12,10': '',
        '12,11': '',
        '12,12': '',
        // middle islands
        '4,6': '',
        '6,4': '',
        '6,8': '',
        '8,6': '',
      }
    };

    this.afs.collection('maps').doc('default').set(map);
  }
}
