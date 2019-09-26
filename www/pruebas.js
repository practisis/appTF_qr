var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('SELECT l.nombre as Loc ,  d.nombre as Desc , d.precio as Pre , t.cantidad as Cant from localidad as l , descuentos as d , tickets_entregados as t  where l.id_loc = t.id_loc and  t.id_desc = d.id ',[],function(tx,results){
					var registro = results.rows.length;
					<!-- alert(registro); -->
					if(registro > 0){
						var datos = '';
						var tr = '';
						var sumaC = 0;
						var sumaT = 0;
						$('#ticketsIngresados').append('<thead><tr><td>Localidad</td><td>Descuento</td><td style = "text-align:center;">Precio</td><td style = "text-align:center;">Cantidad</td><td style = "text-align:center;">Total</td></tr></thead>');
						for(var j = 0; j < registro; j++){
							var row1 = results.rows.item(j);
							var Loc = row1.Loc;
							var Desc = row1.Desc;
							var Pre = row1.Pre;
							var Cant = row1.Cant;
							
							sumaC += parseInt(Cant);
							sumaT += parseFloat((parseFloat(Pre) * parseInt(Cant)));
							<!-- alert(Loc) -->
							
							$('#ticketsIngresados').append('<tbody><tr><td>'+Loc+'</td><td>'+Desc+'</td><td style = "text-align:center;" >USD$ '+Pre+'</td><td style = "text-align:center;">'+Cant+'</td><td style = "text-align:center;">USD$ '+(parseFloat(Pre) * parseInt(Cant))+'</td></tr></tbody>');
							
							
						}
						<!-- $('#ticketsIngresados').html(tr); -->
						$('#ticketsIngresados').append('<tfoot><tr><td></td><td></td><td>Total</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">'+sumaC+'</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">USD$ '+sumaT+'</td></tr></tfoot>');
					}
					
				},errorCB,successCB);
			});