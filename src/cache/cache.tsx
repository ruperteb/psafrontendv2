import { InMemoryCache, Reference } from '@apollo/client';
import {navigationState, pdfVariables, selectedPropertyList} from "../reactivevariables/reactivevariables"


export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn() {
          return isLoggedInVar()

        }, 

        navigationState: {
          read () {
            return navigationState();
          }
        },

        selectedPropertyList: {
          read () {
            return selectedPropertyList();
          }
        },

        pdfVariables: {
          read () {
            return pdfVariables();
          }
        },

        launches: {
          keyArgs: false,
          merge(existing, incoming) {
            let launches: Reference[] = [];
            if (existing && existing.launches) {
              launches = launches.concat(existing.launches);
            }
            if (incoming && incoming.launches) {
              launches = launches.concat(incoming.launches);
            }
            return {
              ...incoming,
              launches,
            };
          }
        }
      }
    }
  }
});

export const isLoggedInVar =
  cache.makeVar<boolean>(
    !!localStorage.getItem('token'));

export const token: any =

  localStorage.getItem('token')

  


