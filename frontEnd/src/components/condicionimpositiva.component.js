import { networkInterfaces } from "os";

    export function DevolverTexto(num){
                    var arr = [];
                    switch(num){
                        case 1: { 
                              arr[0] = 'IVA RESPONSABLE INSCRIPTO'; 
                              arr[1]= 'Factura A';
                              arr[2] = true; break}
                        case 2: { 
                              arr[0] = 'IVA RESPONSABLE NO INSCRIPTO'; 
                              arr[1] = 'Factura B';
                              arr[2] = true; break}
                        case 3: { 
                              arr[0] = 'CONSUMIDOR FINAL'; 
                              arr[1] = 'Factura B';
                              arr[2] = false; break}       
                        case 4: { 
                              arr[0] = 'RESPONSABLE MONOTRIBUTO'; 
                              arr[1] = 'Factura B';
                              arr[2] = false; break}                             
                        case 5: { 
                              arr[0] = 'IVA NO RESPONSABLE'; 
                              arr[1] = 'Factura B';
                              arr[2] = false; break}                             
                        case 6: { 
                              arr[0] = 'IVA EXENTO'; 
                              arr[1] = 'Factura B'; 
                              arr[2] = false; break}  
                        case 7: { 
                              arr[0] = 'PEQUEÑO CONTRIBUYENTE EVENTUAL'; 
                              arr[1] = 'Factura B';
                              arr[2] = false; break}  
                        case 8: { 
                              arr[0] = 'SUJETO NO CATEGORIZADO'; 
                              arr[1] = 'Factura B';
                              arr[2] = false; break}        
                      }  
                      return arr;
        }


export function DevolverNumero(text){
      var n;
      switch (text){
            case 'Factura A': {n = 1; break}
            case 'Factura B': {n = 6; break}
            case 'Nota de credito A': {n = 3; break}
            case 'Nota de credito B': {n = 8; break}
            case 'Nota de debito A': {n = 2; break}
            case 'Nota de debito B': {n = 7; break}
      }
      return n;
}