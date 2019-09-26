	function verTicketsEntregadosVsVendidos(){
		$('#cuerpoDiferencias').html('');
		var nom_empleado = $('#nom_empleado').val();
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql('SELECT l.nombre as Loc , l.id_loc  ,d.nombre as Desc , d.precio as Pre , t.cantidad as Cant from localidad as l , descuentos as d , tickets_entregados as t  where l.id_loc = t.id_loc and  t.id_desc = d.id ',[],function(tx,results){
				var registro = results.rows.length;
				<!-- alert(registro); -->
				if(registro > 0){
					var datos = '';
					var tr = '';
					var sumaC = 0;
					var sumaT = 0;
					$('#cuerpoDiferencias').append('<thead><tr><td>Localidad</td><td>Descuento</td><td style = "text-align:center;">Cantidad</td><td style = "text-align:center;">Vendidos</td><td style = "text-align:center;">Diferencia</td></tr></thead>');
					for(var j = 0; j < registro; j++){
						var row1 = results.rows.item(j);
						var Loc = row1.Loc;
						var Desc = row1.Desc;
						var id_loc = row1.id_loc;
						var Pre = row1.Pre;
						var Cant = row1.Cant;
						
						sumaC += parseInt(Cant);
						sumaT += parseFloat((parseFloat(Pre) * parseInt(Cant)));
						<!-- alert(Loc) -->
						
						$('#cuerpoDiferencias').append('<tbody><tr><td>'+Loc+'</td><td>'+Desc+'</td><td style = "text-align:center;">'+Cant+'</td><td style = "text-align:center;"  ><table class="table table-bordered table table-condensed" id = "contieneVendidosLocalidad_'+id_loc+'">'+verTicketsVendidosLocalidad(id_loc,nom_empleado,Cant)+'</table></td><td class = "contieneTotalDiferencias" id = "contieneDiferencias_'+id_loc+'" style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px;vertical-align:middle;" ></td></tr></tbody>');
						
						
					}
					<!-- $('#cuerpoDiferencias').html(tr); -->
					$('#cuerpoDiferencias').append('<tfoot><tr><td></td><td>Total</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">'+sumaC+'</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px"></td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px" id = "sumaDiferencias" ></td></tr></tfoot>');
				}
				
			},errorCB,successCB);
		});
		
	}
	
	
	function verTicketsVendidosLocalidad(id_locaa,nom_empleado,CantidadM){
		// alert('hola' + id_locaa + 'emplesdo : ' + nom_empleado);
		$('#contieneVendidosLocalidad_'+id_locaa).html('');
		
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			// alert(" SELECT count(idabajo) as cuantos , (valor) as valor , d.tipo as tipoDesc from Boleto as b , localidad as l , descuentos as d  where idLocB = '"+id_locaa+"' and id_descuento != '' and l.id_loc = b.idLocB and b.id_descuento = d.id and l.id_loc = d.localidad and nom_empleado = '"+nom_empleado+"' group by b.id_descuento;")
			tx.executeSql(" SELECT d.nombre as Descuento , count(idabajo) as cuantos , (valor) as valor , d.tipo as tipoDesc from Boleto as b , localidad as l , descuentos as d  where idLocB = '"+id_locaa+"' and id_descuento != '' and l.id_loc = b.idLocB and b.id_descuento = d.id and l.id_loc = d.localidad and nom_empleado = '"+nom_empleado+"' group by b.id_descuento;",[],function(tx,results){
				var registro = results.rows.length;
			<!-- alert(registro); -->
				if(registro > 0){
					var datos = '';
					var tr = '';
					var sumaC = 0;
					var sumaT = 0;
					$('#contieneVendidosLocalidad_'+id_locaa).append('<thead><tr><td style = "text-align:center;">Descuento </td><td style = "text-align:center;">Cantidad </td><td style = "text-align:center;">Precio</td><td style = "text-align:center;">Total</td></tr></thead>');
					for(var j = 0; j < registro; j++){
						var row1 = results.rows.item(j);
						var Loc = row1.Localidad;
						var Desc = row1.Descuento;
						
						var Cant = row1.cuantos;
						var tipoDesc = row1.tipoDesc;
						
						if(tipoDesc == 1){
							var Pre = (row1.valor / 2);
							var color = 'red';
						}else{
							var Pre = row1.valor;
							var color = 'blue';
						}
						
						sumaC += parseInt(Cant);
						sumaT += parseFloat((parseFloat(Pre) * parseInt(Cant)));
						<!-- alert(Loc) -->
						
						$('#contieneVendidosLocalidad_'+id_locaa).append('<tbody><tr><td style = "text-align:center;">'+Desc+'</td><td style = "text-align:center;">'+Cant+'</td><td style = "text-align:center;color:'+color+';" >USD$ '+Pre+'</td><td style = "text-align:center;">USD$ '+(parseFloat(Pre) * parseInt(Cant))+'</td></tr></tbody>');
						calculaDiferencias(CantidadM,sumaC,id_locaa);
						
					}
					<!-- $('#contieneVendidosLocalidad_'+id_locaa).html(tr); -->
					$('#contieneVendidosLocalidad_'+id_locaa).append('<tfoot><tr><td>Total</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">'+sumaC+'</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px"></td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">USD$ '+sumaT+'</td></tr></tfoot>');
				}
				
			},errorCB,successCB);
		});
		
	}
	
	function calculaDiferencias(Cant,sumaC,id_locaa){
		var restaDiferencias = (parseInt(Cant) - parseInt(sumaC));
		$('#contieneDiferencias_'+id_locaa).html(restaDiferencias);
		$('#contieneDiferencias_'+id_locaa).attr('dato',restaDiferencias);
		setTimeout(function() {
			sumarDiferencias();
		}, 1500);
	}
	
	
	function sumarDiferencias(){
		var variableAcumuladora = 0 ; 
		$('.contieneTotalDiferencias').each(function(){
			variableAcumuladora += Number($(this).attr("dato"));
		}); 
		// alert(variableAcumuladora)
		$('#sumaDiferencias').html(variableAcumuladora);
	}
	function reporteDiferencias(){
		$('#cuerpoDiferencias').html('');
		var nom_empleado = $('#nom_empleado').val();
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql("SELECT l.nombre as Localidad , d.nombre as Descuento , te.cantidad as entregados, count(idabajo) as vendidos , (te.cantidad - count(idabajo)) as diferencia from Boleto as b , localidad as l , descuentos as d , tickets_entregados as te where id_descuento != '' and b.idLocB = l.id_loc and b.id_descuento = d.id and l.id_loc = d.localidad and b.idLocB = te.id_loc and nom_empleado = ?  group by b.id_descuento;",[nom_empleado],function(tx,results){
				var registro = results.rows.length;
			<!-- alert(registro); -->
				if(registro > 0){
					var datos = '';
					var tr = '';
					var sumaC = 0;
					var sumaT = 0;
					var vendidos = 0;
					var Diferencia = 0;
					var SumaDif = 0;
					$('#cuerpoDiferencias').append('<thead><tr><th>Localidad</th><th>Descuento</th><th style = "text-align:center;">Entregados </th><th style = "text-align:center;">Vendidos</th><th>Diferencia</th></tr></thead>');
					for(var j = 0; j < registro; j++){
						var row1 = results.rows.item(j);
						var Loc = row1.Localidad;
						var Desc = row1.Descuento;
						var Pre = row1.entregados;
						var Cant = row1.vendidos;
						var cuantos = row1.diferencia;
						
						
						sumaC += parseInt(Pre);
						sumaT += parseInt(Cant);
						SumaDif += parseInt(cuantos);
						<!-- alert(Loc) -->
						
						$('#cuerpoDiferencias').append('<tbody><tr style = "font-size:12px;" ><td style = "width:35%;" >'+Loc+'</td><td style = "width:35%;">'+Desc+'</td><td style = "text-align:center;width:10%;">'+Pre+'</td><td style = "text-align:center;width:10%;">'+Cant+'</td><td style = "text-align:center;width:10%;">'+cuantos+'</td></tr></tbody>');
						
						
					}
					<!-- $('#cuerpoDiferencias').html(tr); -->
					$('#cuerpoDiferencias').append('<tfoot><tr><td></td><td>Total</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">'+sumaC+'</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">'+sumaT+'</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">'+SumaDif+'</td></tr></tfoot>');
				}
				
			},errorCB,successCB);
		});
		
	}
	
	function verTicketsVendidos(){
		$('#ticketsVendidos').html('');
		var nom_empleado = $('#nom_empleado').val();
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql(" SELECT l.nombre as Localidad , d.nombre as Descuento , count(idabajo) as cuantos , (valor) as valor , (count(idabajo) * (valor)) as total , d.tipo as tipoDesc from Boleto as b , localidad as l , descuentos as d  where id_descuento != '' and l.id_loc = b.idLocB and b.id_descuento = d.id and l.id_loc = d.localidad and nom_empleado = ? group by b.id_descuento;",[nom_empleado],function(tx,results){
				var registro = results.rows.length;
			<!-- alert(registro); -->
				if(registro > 0){
					var datos = '';
					var tr = '';
					var sumaC = 0;
					var sumaT = 0;
					$('#ticketsVendidos').append('<thead><tr><td>Localidad</td><td>Descuento</td><td style = "text-align:center;">Precio</td><td style = "text-align:center;">Cantidad </td><td style = "text-align:center;">Total</td></tr></thead>');
					for(var j = 0; j < registro; j++){
						var row1 = results.rows.item(j);
						var Loc = row1.Localidad;
						var Desc = row1.Descuento;
						
						var Cant = row1.cuantos;
						var tipoDesc = row1.tipoDesc;
						
						if(tipoDesc == 1){
							var Pre = (row1.valor / 2);
							var color = 'red';
						}else{
							var Pre = row1.valor;
							var color = 'blue';
						}
						
						sumaC += parseInt(Cant);
						sumaT += parseFloat((parseFloat(Pre) * parseInt(Cant)));
						<!-- alert(Loc) -->
						
						$('#ticketsVendidos').append('<tbody><tr><td>'+Loc+'</td><td>'+Desc+'</td><td style = "text-align:center;color:'+color+';" >USD$ '+Pre+'</td><td style = "text-align:center;">'+Cant+'</td><td style = "text-align:center;">USD$ '+(parseFloat(Pre) * parseInt(Cant))+'</td></tr></tbody>');
						
						
					}
					<!-- $('#ticketsVendidos').html(tr); -->
					$('#ticketsVendidos').append('<tfoot><tr><td></td><td></td><td>Total</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">'+sumaC+'</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">USD$ '+sumaT+'</td></tr></tfoot>');
				}
				
			},errorCB,successCB);
		});
		
	}
	<!-- SELECT l.ncuento , idLocBombre as Localidad , d.nombre as Descuento , count(idabajo) as cuantos , (valor) as valor , (count(idabajo) * (valor)) as total  -->
	<!-- from Boleto as b , localidad as l , descuentos as d  -->
	<!-- where id_descuento != '' -->
	<!-- and l.id_loc = b.idLocB -->
	<!-- and b.id_descuento = d.id -->
	<!-- and l.id_loc = d.localidad -->
	<!-- group by id_des -->
	function validarCedulaVendida(){
		var ingBarcode = $('#ingBarcode').val();
		var ingCedula = $('#ingCedula').val();
		
		if(ingBarcode == '' || ingCedula == ''){
			document.getElementById('player1').play();
			$('.smsback').css('background-color','#f0ad4e');
			$('#titlemodal').html('ERROR CAMPOS REQUERIDOS!!!');
			$('#mensaje').html('DEBE INGRESAR CODIGO DE BARRAS Y CEDULA PARA CONTINUAR !!! ');
			$('#sms').modal('show');
			setTimeout(function(){
				//alert("Boom!");
				document.getElementById('player1').pause();
				$('#sms').modal('hide');
				$('#ingBarcode').val('');
				$('#ingCedula').val('');
				$('#ingBarcode').focus();
			}, 3000);
		}else{
			<!-- alert('SELECT count(idCli) from Boleto where idCli = '+ingCedula+''); -->
			var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('SELECT idCli from Boleto where idCli = '+ingCedula+';',[],function(tx,results){
					var registro = results.rows.length;
					// alert(registro);
					if(registro > 0){
						document.getElementById('player1').play();
						$('.smsback').css('background-color','#f0ad4e');
						$('#titlemodal').html('CEDULA REPETIDA !!!');
						$('#mensaje').html('LA CEDULA INGRESADA YA A COMPRADO UN TICKET , NO PUEDE COMPRAR OTRO PARA EL MISMO EVENTO !!!');
						$('#sms').modal('show');
						setTimeout(function(){
							//alert("Boom!");
							document.getElementById('player1').pause();
							$('#sms').modal('hide');
							$('#ingBarcode').val('');
							$('#ingCedula').val('');
							$('#ingBarcode').focus();
						}, 3000);
					}else{
						<!-- alert('no hay') -->
						registroVentaDescuento(ingCedula);
					}
					
				},errorCB,successCB);
			});
		}
	}
	function ingresoTicket(e){
		console.log(e.keyCode);
		var controlTiposTickets = $('#controlTiposTickets').val();
		if(e.keyCode == 13){
			if(controlTiposTickets == 0){ 
				registroVentaNormal();
			 }else{ 
				<!-- alert('tiene seleccionado descuento especial y debe ingresar una cedula para continuar') -->
				// validarCedulaVendida(); 
				$('#ingCedula').focus();
				$('#ingCedula').css('border','1px solid red');
			} 
			
		}
	}


	function validarCedula(e){
		console.log(e.keyCode);
		var controlTiposTickets = $('#controlTiposTickets').val();
		if(e.keyCode == 13){
			if(controlTiposTickets == 1){
				validarCedulaVendida();
			}else{
				<!-- alert('tiene seleccionado descuento ninguno y debe ingresar una cedula para continuar') -->
			}
			
		}
	}

	var meses = new Array ("01","02","03","04","05","06","07","08","09","10","11","12");
	var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
	var f = new Date();;
	var valor = f.getFullYear()+'-'+meses[f.getMonth()]+'-'+f.getDate();

	var hora = f.getHours();
	var minuto = f.getMinutes();
	var segundo = f.getSeconds(); 

	var horas = hora+':'+minuto+':'+segundo;

	var timestamp = valor+' '+horas;


	function registroVentaNormal(){
		var controlTiposTickets = $('#controlTiposTickets').val();
		var nom_empleado = $('#nom_empleado').val();
		// alert('hola');
		var reloj = $("#iframe1").contents().find("#reloj").val();
		var playing = false;
		var codigo = $('#ingBarcode').val();
		if(codigo == ''){
			$('#error1').modal('show');
			document.getElementById('player1').play();
			
			setTimeout(function(){
				//alert("Boom!");
				document.getElementById('player1').pause();
				$('#error1').modal('hide');
			}, 1000);
		}else{
			$('#btnvalidar').fadeOut('slow');
			$('#waitvalidar').delay(600).fadeIn('slow');
			// alert(codigo+' - '+cedula);
			var playing = false;
			var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('SELECT strEstado , idBoleto ,  identComprador , strQr , idLocB FROM Boleto WHERE strBarcode = ?;',[codigo],function(tx,results){
					var registros = results.rows.length;
					if(registros > 0){
						var row = results.rows.item(0);
						
						var estado = row.strEstado;
						var id = row.idBoleto;
						var identComprador = row.identComprador;
						var strQr = row.strQr;
						var idLocB = row.idLocB;
						
						if(identComprador == 1){
							$('.smsback').css('background-color','red');
							$('#mensaje').css('color','white');
							$('#titlemodal').html('Atención');
							$('#mensaje').html('El Boleto  ' +  codigo  + '  NO PUEDE INGRESAR AL EVENTO YA QUE NO ESTA CANJEADO POR EL REAL Y DEBE CANJEARLO');
							$('#nombre').html(row.nombreHISB);
							$('#sms').modal('show');
							setTimeout(function(){
								//alert("Boom!");
								$('#sms').modal('hide');
								$('#ingBarcode').val('');
								$('#ingCedula').val('');
								$('#ingBarcode').focus();
							}, 2000);
							//window.location = '';
						}else{
							<!-- alert(strQr) -->
							if(strQr == '' ){
									document.getElementById('player1').play();
									$('.smsback').css('background-color','#f0ad4e');
									$('#titlemodal').html('DEBE SINCRONIZAR SU APP PARA PODER LEER ESTE CODIGO DE BARRAS!!!');
									$('#mensaje').html('SINCRONIZAR!!!');
									$('#sms').modal('show');
									setTimeout(function(){
										//alert("Boom!");
										document.getElementById('player1').pause();
										$('#sms').modal('hide');
										$('#ingBarcode').val('');
										$('#ingCedula').val('');
										$('#ingBarcode').focus();
										bajarTodas();
									}, 3000);
							}else if(strQr == 0 ){
								var idDesc = (strQr+idLocB+strQr);
								if(estado == "A"){
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('select id as id_descuento from descuentos where id_desc = ? and localidad = ? order by id desc limit 1',[idDesc,idLocB],function(tx,results){
											var registro = results.rows.length;
											 <!-- alert(registro); -->
											if(registro > 0){
												for(var j = 0; j < registro; j++){
													var row1 = results.rows.item(j);
													var id_descuento = row1.id_descuento;
													<!-- alert(id_descuento) -->
													var idabajo = row.idabajo;
													var inactivo = "V";
													var idCli = 0;
													// alert(nombre);
													document.getElementById('player').play();
													$('.smsback').css('background-color','#5cb85c');
													$('#titlemodal').html('Boleto Correcto!');
													$('#mensaje').html('Datos Correctos, INGRESE!');
													$('#nombre').html(row.nombreHISB);
													var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
													db.transaction(function(tx){
														tx.executeSql('UPDATE Boleto SET nom_empleado = ? , idCli = ? , id_descuento = ? , strEstado = ?  , hora_ingreso = ? WHERE strBarcode = ?;',[nom_empleado , idCli , id_descuento , inactivo,reloj,codigo],function(tx,results){
															
														});
													},errorCB,successCB);
													
													var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
													db.transaction(function(tx){
														tx.executeSql('INSERT INTO auditoria (idBoleto,estado,fecha) VALUES (?,?,?);',[id,'Boleto Correcto',timestamp],function(tx,res){
															
														});                
													},errorCB,successCB);
													$('#sms').modal('show');
													setTimeout(function(){
														//alert("Boom!");
														document.getElementById('player').pause();
														$('#sms').modal('hide');
														$('#ingBarcode').val('');
														$('#ingCedula').val('');
														$('#ingBarcode').focus();
													}, 2000);

												}
											}
											
										},errorCB,successCB);
									});
									
								}else if(estado == "ANU"){
									// alert('ya usado');
									var idabajo = row.idabajo;
									var inactivo = "V";
									document.getElementById('player2').play();
									
									
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('UPDATE Boleto SET documentoHISB = ? , hora_ingreso = ? WHERE strBarcode = ? ;',[inactivo,reloj,codigo],function(tx,results){
											
										});
									},errorCB,successCB);
									
									
									
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO auditoria (idBoleto,estado,fecha) VALUES (?,?,?);',[id,'Boleto Usado',timestamp],function(tx,res){
											
										});                
									},errorCB,successCB);
									
									$('.smsback').css('background-color','#6001D2');
									$('#titlemodal').css('color','#fff');
									$('#titlemodal').html('BOLETO REIMPRESO!');
									$('#mensaje').css('color','#fff');
									$('#mensaje').html('BOLETO REIMPRESO!!!!<br>retenga el boleto ');
									$('#nombre').html(row.nombreHISB);
									$('#sms').modal('show');
									setTimeout(function(){
										//alert("Boom!");
										document.getElementById('player2').pause();
										$('#sms').modal('hide');
										$('#ingBarcode').val('');
										$('#ingCedula').val('');
										$('#ingBarcode').focus();
									}, 3000);
								}else if(estado == "V"){
									// alert('ya usado');
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO auditoria (idBoleto,estado,fecha) VALUES (?,?,?);',[id,'Boleto Usado',timestamp],function(tx,res){
											
										});                
									},errorCB,successCB);
									
									
									
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO errores (nombre , estado) VALUES (?,?);',['Boleto Usado','1'],function(tx,res){
											
										});                
									},errorCB,successCB);
									
									
									
									document.getElementById('player1').play();
									$('.smsback').css('background-color','#C51D34');
									$('#titlemodal').html('Boleto Correcto!');
									$('#mensaje').html('BOLETO VENDIDO !!!!');
									$('#nombre').html(row.nombreHISB);
									$('#sms').modal('show');
									setTimeout(function(){
										//alert("Boom!");
										document.getElementById('player1').pause();
										$('#sms').modal('hide');
										$('#ingBarcode').val('');
										$('#ingCedula').val('');
										$('#ingBarcode').focus();
									}, 3000);
								}
							}else{
								seleccionaTipoDescuento(1)
								$('#ingCedula').focus
							}
						}
					}else{
						document.getElementById('player1').play();
						$('.smsback').css('background-color','#f0ad4e');
						$('#titlemodal').html('Boleto Incorrecto!');
						$('#mensaje').html('Datos Incorrectos!');
						$('#sms').modal('show');
						setTimeout(function(){
							//alert("Boom!");
							document.getElementById('player1').pause();
							$('#sms').modal('hide');
							$('#ingBarcode').val('');
							$('#ingCedula').val('');
							$('#ingBarcode').focus();
						}, 2000);
						
						var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
						db.transaction(function(tx){
							tx.executeSql('INSERT INTO errores (nombre , estado) VALUES (?,?);',['Boleto incorrecto','2'],function(tx,res){
								
							});                
						},errorCB,successCB);
					}
					$('#waitvalidar').fadeOut('slow');
					$('#btnvalidar').delay(600).fadeIn('slow');
				});
			},errorCB,successCB);
			// setTimeout(function(){
					// $('.smsback').css('background-color','#fff');
					// $('#titlemodal').html('');
					// $('#mensaje').html('');
					// $('#nombre').html('');
					// $('#sms').modal('hide');
					// $('#onlycodigo').val('');
					// $('#codigo').focus();
					// $('#onlycodigo').focus();
			// },1000);
			//$('#onlycodigo').focus();
			
		}
	}


	function registroVentaDescuento(cedula){
		var controlTiposTickets = $('#controlTiposTickets').val();
		var nom_empleado = $('#nom_empleado').val();
		// alert('hola');
		var reloj = $("#iframe1").contents().find("#reloj").val();
		var playing = false;
		var codigo = $('#ingBarcode').val();
		if(codigo == ''){
			$('#error1').modal('show');
			document.getElementById('player1').play();
			
			setTimeout(function(){
				//alert("Boom!");
				document.getElementById('player1').pause();
				$('#error1').modal('hide');
			}, 1000);
		}else{
			$('#btnvalidar').fadeOut('slow');
			$('#waitvalidar').delay(600).fadeIn('slow');
			// alert(codigo+' - '+cedula);
			var playing = false;
			var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('SELECT strEstado , idBoleto ,  identComprador , strQr , idLocB FROM Boleto WHERE strBarcode = ?;',[codigo],function(tx,results){
					var registros = results.rows.length;
					if(registros > 0){
						var row = results.rows.item(0);
						
						var estado = row.strEstado;
						var id = row.idBoleto;
						var identComprador = row.identComprador;
						var strQr = row.strQr;
						var idLocB = row.idLocB;
						
						if(identComprador == 1){
							$('.smsback').css('background-color','red');
							$('#mensaje').css('color','white');
							$('#titlemodal').html('Atención');
							$('#mensaje').html('El Boleto  ' +  codigo  + '  NO PUEDE INGRESAR AL EVENTO YA QUE NO ESTA CANJEADO POR EL REAL Y DEBE CANJEARLO');
							$('#nombre').html(row.nombreHISB);
							$('#sms').modal('show');
							setTimeout(function(){
								//alert("Boom!");
								$('#sms').modal('hide');
								$('#ingBarcode').val('');
								$('#ingCedula').val('');
								$('#ingBarcode').focus();
							}, 2000);
							//window.location = '';
						}else{
							// alert('strQr : ' + strQr  + '  estado : ' + estado  + ' control Tipos Tickets : ' + controlTiposTickets );
							if(strQr == '' ){
									document.getElementById('player1').play();
									$('.smsback').css('background-color','#f0ad4e');
									$('#titlemodal').html('DEBE SINCRONIZAR SU APP PARA PODER LEER ESTE CODIGO DE BARRAS!!!');
									$('#mensaje').html('SINCRONIZAR!!!');
									$('#sms').modal('show');
									setTimeout(function(){
										//alert("Boom!");
										document.getElementById('player1').pause();
										$('#sms').modal('hide');
										$('#ingBarcode').val('');
										$('#ingCedula').val('');
										$('#ingBarcode').focus();
										bajarTodas()
									}, 3000);
							}else if(strQr != 0 && controlTiposTickets != 0 ){
								if(estado == "A"){
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('select id as id_descuento from descuentos where id_desc = ? and localidad = ? order by id desc limit 1',[strQr,idLocB],function(tx,results){
											var registro = results.rows.length;
											 <!-- alert(registro); -->
											if(registro > 0){
												for(var j = 0; j < registro; j++){
													var row1 = results.rows.item(j);
													var id_descuento = row1.id_descuento;
													<!-- alert(id_descuento) -->
													var idabajo = row.idabajo;
													var inactivo = "V";
													// alert(nombre);
													document.getElementById('player').play();
													$('.smsback').css('background-color','#5cb85c');
													$('#titlemodal').html('Boleto Correcto!');
													$('#mensaje').html('DATOS CORRECTOS!!!');
													$('#nombre').html(row.nombreHISB);
													var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
													db.transaction(function(tx){
														tx.executeSql('UPDATE Boleto SET nom_empleado = ? , idCli = ? , id_descuento = ? , strEstado = ?  , hora_ingreso = ? WHERE strBarcode = ?;',[nom_empleado , cedula , id_descuento , inactivo,reloj,codigo],function(tx,results){
															
														});
													},errorCB,successCB);
													
													var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
													db.transaction(function(tx){
														tx.executeSql('INSERT INTO auditoria (idBoleto,estado,fecha) VALUES (?,?,?);',[id,'Boleto Correcto',timestamp],function(tx,res){
															
														});                
													},errorCB,successCB);
													$('#sms').modal('show');
													setTimeout(function(){
														//alert("Boom!");
														document.getElementById('player').pause();
														$('#sms').modal('hide');
														$('#ingBarcode').val('');
														$('#ingCedula').val('');
														$('#ingBarcode').focus();
														sincroniza();
													}, 3000);

												}
											}
											
										},errorCB,successCB);
									});
									
								}else if(estado == "ANU"){
									// alert('ya usado');
									var idabajo = row.idabajo;
									var inactivo = "V";
									document.getElementById('player2').play();
									
									
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('UPDATE Boleto SET documentoHISB = ? , hora_ingreso = ? WHERE strBarcode = ? ;',[inactivo,reloj,codigo],function(tx,results){
											
										});
									},errorCB,successCB);
									
									
									
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO auditoria (idBoleto,estado,fecha) VALUES (?,?,?);',[id,'Boleto Usado',timestamp],function(tx,res){
											
										});                
									},errorCB,successCB);
									
									$('.smsback').css('background-color','#6001D2');
									$('#titlemodal').css('color','#fff');
									$('#titlemodal').html('BOLETO REIMPRESO!');
									$('#mensaje').css('color','#fff');
									$('#mensaje').html('BOLETO REIMPRESO!!!!<br>retenga el boleto ');
									$('#nombre').html(row.nombreHISB);
									$('#sms').modal('show');
									setTimeout(function(){
										//alert("Boom!");
										document.getElementById('player2').pause();
										$('#sms').modal('hide');
										$('#ingBarcode').val('');
										$('#ingCedula').val('');
										$('#ingBarcode').focus();
									}, 3000);
								}else if(estado == "V"){
									// alert('ya usado');
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO auditoria (idBoleto,estado,fecha) VALUES (?,?,?);',[id,'Boleto Usado',timestamp],function(tx,res){
											
										});                
									},errorCB,successCB);
									
									
									
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO errores (nombre , estado) VALUES (?,?);',['Boleto Usado','1'],function(tx,res){
											
										});                
									},errorCB,successCB);
									
									
									
									document.getElementById('player1').play();
									$('.smsback').css('background-color','#C51D34');
									$('#titlemodal').html('Boleto Correcto!');
									$('#mensaje').html('BOLETO VENDIDO !!!!');
									$('#nombre').html(row.nombreHISB);
									$('#sms').modal('show');
									setTimeout(function(){
										//alert("Boom!");
										document.getElementById('player1').pause();
										$('#sms').modal('hide');
										$('#ingBarcode').val('');
										$('#ingCedula').val('');
										$('#ingBarcode').focus();
									}, 3000);
								}
							}else{
								// document.getElementById('player1').play();
								// $('.smsback').css('background-color','#f0ad4e');
								// $('#titlemodal').html('Boleto Correcto!');
								// $('#mensaje').html('<strong>ESTA LEYENDO UN TICKET NORMAL Y TIENE SELECCIONADO UN DESCUENTO ESPECIAL DEBE CAMBIAR</strong>');
								// $('#sms').modal('show');
								// setTimeout(function(){
									// //alert("Boom!");
									// document.getElementById('player1').pause();
									// $('#sms').modal('hide');
									// $('#ingBarcode').val('');
									// $('#ingBarcode').focus();
								// }, 4000);
								
								// var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
								// db.transaction(function(tx){
									// tx.executeSql('INSERT INTO errores (nombre , estado) VALUES (?,?);',['Boleto incorrecto','2'],function(tx,res){
										
									// });                
								// },errorCB,successCB);
								
								if(estado == "A"){
									var tipo = 1;
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('select id as id_descuento from descuentos where localidad = ? and tipo = ? order by id desc limit 1',[idLocB,tipo],function(tx,results){
											var registro = results.rows.length;
											 <!-- alert(registro); -->
											if(registro > 0){
												for(var j = 0; j < registro; j++){
													var row1 = results.rows.item(j);
													var id_descuento = row1.id_descuento;
													<!-- alert(id_descuento) -->
													var idabajo = row.idabajo;
													var inactivo = "V";
													// alert(nombre);
													document.getElementById('player').play();
													$('.smsback').css('background-color','#5cb85c');
													$('#titlemodal').html('Boleto Correcto!');
													$('#mensaje').html('DATOS CORRECTOS!!!');
													$('#nombre').html(row.nombreHISB);
													var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
													db.transaction(function(tx){
														tx.executeSql('UPDATE Boleto SET nom_empleado = ? , idCli = ? , id_descuento = ? , strEstado = ?  , hora_ingreso = ? WHERE strBarcode = ?;',[nom_empleado , cedula , id_descuento , inactivo,reloj,codigo],function(tx,results){
															
														});
													},errorCB,successCB);
													
													var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
													db.transaction(function(tx){
														tx.executeSql('INSERT INTO auditoria (idBoleto,estado,fecha) VALUES (?,?,?);',[id,'Boleto Correcto',timestamp],function(tx,res){
															
														});                
													},errorCB,successCB);
													$('#sms').modal('show');
													setTimeout(function(){
														//alert("Boom!");
														document.getElementById('player').pause();
														$('#sms').modal('hide');
														$('#ingBarcode').val('');
														$('#ingCedula').val('');
														$('#ingBarcode').focus();
														sincroniza();
													}, 3000);

												}
											}
											
										},errorCB,successCB);
									});
									
								}else if(estado == "ANU"){
									// alert('ya usado');
									var idabajo = row.idabajo;
									var inactivo = "V";
									document.getElementById('player2').play();
									
									
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('UPDATE Boleto SET documentoHISB = ? , hora_ingreso = ? WHERE strBarcode = ? ;',[inactivo,reloj,codigo],function(tx,results){
											
										});
									},errorCB,successCB);
									
									
									
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO auditoria (idBoleto,estado,fecha) VALUES (?,?,?);',[id,'Boleto Usado',timestamp],function(tx,res){
											
										});                
									},errorCB,successCB);
									
									$('.smsback').css('background-color','#6001D2');
									$('#titlemodal').css('color','#fff');
									$('#titlemodal').html('BOLETO REIMPRESO!');
									$('#mensaje').css('color','#fff');
									$('#mensaje').html('BOLETO REIMPRESO!!!!<br>retenga el boleto ');
									$('#nombre').html(row.nombreHISB);
									$('#sms').modal('show');
									setTimeout(function(){
										//alert("Boom!");
										document.getElementById('player2').pause();
										$('#sms').modal('hide');
										$('#ingBarcode').val('');
										$('#ingCedula').val('');
										$('#ingBarcode').focus();
									}, 3000);
								}else if(estado == "V"){
									// alert('ya usado');
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO auditoria (idBoleto,estado,fecha) VALUES (?,?,?);',[id,'Boleto Usado',timestamp],function(tx,res){
											
										});                
									},errorCB,successCB);
									
									
									
									var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO errores (nombre , estado) VALUES (?,?);',['Boleto Usado','1'],function(tx,res){
											
										});                
									},errorCB,successCB);
									
									
									
									document.getElementById('player1').play();
									$('.smsback').css('background-color','#C51D34');
									$('#titlemodal').html('Boleto Correcto!');
									$('#mensaje').html('BOLETO VENDIDO !!!!');
									$('#nombre').html(row.nombreHISB);
									$('#sms').modal('show');
									setTimeout(function(){
										//alert("Boom!");
										document.getElementById('player1').pause();
										$('#sms').modal('hide');
										$('#ingBarcode').val('');
										$('#ingCedula').val('');
										$('#ingBarcode').focus();
									}, 3000);
								}
							}
						}
					}else{
						document.getElementById('player1').play();
						$('.smsback').css('background-color','#f0ad4e');
						$('#titlemodal').html('Boleto Incorrecto!');
						$('#mensaje').html('Datos Incorrectos!');
						$('#sms').modal('show');
						setTimeout(function(){
							//alert("Boom!");
							document.getElementById('player1').pause();
							$('#sms').modal('hide');
							$('#ingBarcode').val('');
							$('#ingBarcode').focus();
						}, 2000);
						
						var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
						db.transaction(function(tx){
							tx.executeSql('INSERT INTO errores (nombre , estado) VALUES (?,?);',['Boleto incorrecto','2'],function(tx,res){
								
							});                
						},errorCB,successCB);
					}
					$('#waitvalidar').fadeOut('slow');
					$('#btnvalidar').delay(600).fadeIn('slow');
				});
			},errorCB,successCB);
			// setTimeout(function(){
					// $('.smsback').css('background-color','#fff');
					// $('#titlemodal').html('');
					// $('#mensaje').html('');
					// $('#nombre').html('');
					// $('#sms').modal('hide');
					// $('#onlycodigo').val('');
					// $('#codigo').focus();
					// $('#onlycodigo').focus();
			// },1000);
			//$('#onlycodigo').focus();
			
		}
		setTimeout(function(){
			seleccionaTipoDescuento(0)
		},1000);
	}


	<!-- function verDescuentosIngresados(){ -->
		<!-- $('#ticketsIngresados').html(''); -->
		<!-- $('#ingBarcode').focus(); -->
		<!-- var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000); -->
		<!-- db.transaction(function(tx){ -->
			<!-- tx.executeSql('select * from descuentos group by nombre order by id asc ',[],function(tx,results){ -->
				<!-- var registro = results.rows.length; -->
				<!-- <!-- alert(registro); --> -->
				<!-- if(registro > 0){ -->
					<!-- var datos = ''; -->
					<!-- var tr = ''; -->
					<!-- var sumaC = 0; -->
					<!-- var sumaT = 0; -->
					<!-- var checked = ''; -->
					<!-- var op=0; -->
					<!-- tr += '<tbody>'; -->
					<!-- for(var j = 0; j <= 1; j++){ -->
						<!-- var row1 = results.rows.item(j); -->
						
						<!-- var id = row1.id; -->
						<!-- var nombre = row1.nombre; -->
						<!-- var id_desc = row1.id_desc; -->
						<!-- if(id_desc == 0){ -->
							<!-- checked = 'checked'; -->
						<!-- }else{ -->
							<!-- checked = ''; -->
						<!-- } -->
						
						<!-- if(op==0){ -->
							<!-- tr +='<tr>'; -->
						<!-- } -->
						<!-- tr +='<td style = "width:25%;"><input type="radio" id="'+id+'" name="tipoConcierto" '+checked+' onclick = "seleccionaTipoDescuento('+id_desc+')" value = "'+id+'" /><label for="'+id+'" style = "font-size:10px;" ><span></span>'+nombre+'</label></td>'; -->
						<!-- if(op==3){ -->
							<!-- tr +='</tr>'; -->
							<!-- op=0; -->
						<!-- }else{ -->
							<!-- op++; -->
						<!-- } -->
						
						
						
						
					<!-- } -->
					<!-- tr += '</tbody>'; -->
					<!-- $('#contieneOpDescuentos').append(tr); -->
				<!-- }else{ -->
					<!-- tr += '<tr><td><input type="radio" id="r1" name="tipoConcierto" checked value = "1" /><label for="r1" style = "font-size:10px;" ><span></span>Nonguno</label></td></tr>'; -->
					<!-- $('#contieneOpDescuentos').append(tr); -->
				<!-- } -->
				
			<!-- },errorCB,successCB); -->
		<!-- }); -->
		
	<!-- } -->

	function seleccionaTipoDescuento(id){
		if(id == 0 ){
			$('#ingCedula').attr('disabled',true);
			$('#ingCedula').attr('readonly',true);
			$('#ingCedula').val('');
			
			$('#ingBarcode').val('');
			$('#ingBarcode').focus();
			
			$('#controlTiposTickets').val(0);
			
			$('#parrafoTickets').removeClass('alert-danger');
			$('#parrafoTickets').addClass('alert-info');
			$('#contieneValidadorCedula').css('display','none');
			$('#tipoTickets').html(' Normales ');
			
			$('#r2').prop('checked',false);
			$('#r1').prop('checked',true);
		}else{
			
			$('#r1').prop('checked',false);
			$('#r2').prop('checked',true);
			
			$('#ingCedula').attr('disabled',false);
			$('#ingCedula').attr('readonly',false);
			$('#ingCedula').focus();
			$('#controlTiposTickets').val(1);
			
			$('#parrafoTickets').removeClass('alert-info');
			$('#parrafoTickets').addClass('alert-danger');
			$('#contieneValidadorCedula').css('display','block');
			$('#tipoTickets').html(' Especiales (con descuento) ');
			
		}
	}





	function verTicketsEntregados(){
		$('#ticketsIngresados').html('');
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
					$('#ticketsIngresados').append('<thead><tr><td>Localidad</td><td>Descuento</td><td style = "text-align:center;">Cantidad</td></tr></thead>');
					for(var j = 0; j < registro; j++){
						var row1 = results.rows.item(j);
						var Loc = row1.Loc;
						var Desc = row1.Desc;
						var Pre = row1.Pre;
						var Cant = row1.Cant;
						
						sumaC += parseInt(Cant);
						sumaT += parseFloat((parseFloat(Pre) * parseInt(Cant)));
						<!-- alert(Loc) -->
						
						$('#ticketsIngresados').append('<tbody><tr><td>'+Loc+'</td><td>'+Desc+'</td><td style = "text-align:center;">'+Cant+'</td></tr></tbody>');
						
						
					}
					<!-- $('#ticketsIngresados').html(tr); -->
					$('#ticketsIngresados').append('<tfoot><tr><td></td><td>Total</td><td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 16px">'+sumaC+'</td></tr></tfoot>');
				}
				
			},errorCB,successCB);
		});
		
	}
	function grabaCantidades(){
		
		var localidadIngresos = $('#localidadIngresos').val();
		var descuentosIngreso = $('#descuentosIngreso').val();
		var cantidadIngresos = $('#cantidadIngresos').val();
		if(localidadIngresos == '' || descuentosIngreso == '' || cantidadIngresos == ''){
			alert('Todos los campos son Requeridos!!!')
		}else{
			var sumaCAntidades = 0;
			var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
			db.transaction(function(tx){
				<!-- alert('SELECT count(id) as cuantos , cantidad from tickets_entregados where id_loc = '+localidadIngresos+'  and id_desc = '+descuentosIngreso+' '); -->
				tx.executeSql('SELECT count(id) as cuantos , cantidad from tickets_entregados where id_loc = ? and id_desc = ? ',[localidadIngresos , descuentosIngreso],function(tx,results){
					var registroTE = results.rows.length;
					<!-- alert(registroTE); -->
					
					
					for(var j = 0; j < registroTE; j++){
						var rowTE = results.rows.item(j);
						var cuantos = rowTE.cuantos;
						var cantidad = rowTE.cantidad;
						sumaCAntidades = (parseInt(cantidad) + parseInt(cantidadIngresos) );
						if(cuantos > 0){
							$('#titulo_ingresos').css('color','red');
							var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
							db.transaction(function(tx){
								tx.executeSql('update tickets_entregados set cantidad = ? where id_loc = ? and id_desc = ? ',[sumaCAntidades , localidadIngresos , descuentosIngreso],function(tx,results){
									$('.cajasLimpias').val('');
									alert('Tickets entregados ingresados con Exito' );
								});
							},errorCB,successCB);
						}else{
							$('#titulo_ingresos').css('color','blue');
							var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
							db.transaction(function(tx){
								tx.executeSql('insert into tickets_entregados (id_loc , id_desc , cantidad) values (?,?,?) ',[localidadIngresos,descuentosIngreso,cantidadIngresos],function(tx,results){
									$('.cajasLimpias').val('');
									alert('Tickets entregados ingresados con Exito' );
									
								},errorCB,successCB);
							});

						}
					}
					
					
				},errorCB,successCB);
			});
		}
		
	}
	$(document).ready(function(){
		$("#localidadIngresos").change(function(){
			var localidad = $(this).val()
			var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('SELECT * from descuentos where localidad = ? order by nombre ASC ',[localidad],function(tx,results){
					var registro = results.rows.length;
					//alert(registro);
					var datos = '';
					var tr = '';
					
					tr +='<option value = "" >Seleccione Descuento</option>';
					for(var j = 0; j < registro; j++){
						var row1 = results.rows.item(j);
						var nombre = row1.nombre;
						var id = row1.id;
						var precio = row1.precio;
						//alert('<<>>'+ nombreL);
						
						tr +='<option value = "'+id+'" >'+nombre+'  USD$ ['+precio+'] </option>';
						//alert(tr);
						
					}
					<!-- $('#descuentosIngreso').effect('highlight'); -->
					$('#descuentosIngreso').html(tr);
					
				},errorCB,successCB);
			});
		});
	});


	verLocalidades();
	function verLocalidades(){
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql('SELECT * from localidad',[],function(tx,results){
				var registro = results.rows.length;
				//alert(registro);
				var datos = '';
				var tr = '';
				
				tr +='<option value = "" >Seleccione Localidad</option>';
				for(var j = 0; j < registro; j++){
					var row1 = results.rows.item(j);
					var nombre = row1.nombre;
					var id_loc = row1.id_loc;
					//alert('<<>>'+ nombreL);
					
					tr +='<option value = "'+id_loc+'" >'+nombre+'   ['+id_loc+'] </option>';
					//alert(tr);
					
				}
				$('#localidadIngresos').html(tr);
				
			},errorCB,successCB);
		});
		
	}
	fecha = new Date();
	function hora(){
		var hora=fecha.getHours();
		var minutos=fecha.getMinutes();
		var segundos=fecha.getSeconds();
		if(hora<10){ hora='0'+hora;}
		if(minutos<10){minutos='0'+minutos; }
		if(segundos<10){ segundos='0'+segundos; }
		fech=hora+" : "+minutos+" : "+segundos;
		<!-- $('#hora_').html(fech) -->
		$('#reloj_mundial').val(fech)
		fecha.setSeconds(fecha.getSeconds()+1);
		setTimeout("hora()",1000);
	}

	function controlMenu(){
		$('#navigation-index').toggle('blind'); 
	}

	saberEmpleado();
	function saberEmpleado(){
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql('SELECT nombre as nombree , perfil as peerfil FROM empleado',[],function(tx,results){
				var registros = results.rows.length;
				for(var j = 0; j < registros; j++){
					var row1 = results.rows.item(j);
					var nombree = row1.nombree;
					var perfil_empleado = row1.peerfil;
					<!-- alert('<<>>'+ perfil_empleado); -->
					
					<!-- var nombree  = results.rows[0].nombree; -->
					<!-- var perfil_empleado  = results.rows[1].perfil_empleado; -->
					
					$('#nom_empleado').val(nombree);
					$('#perfil_empleado').val(perfil_empleado);
				
				}
				
				
				<!-- alert(nombree); -->
			},errorCB,successCB);
		});
	}

	saberConcierto();



	function saberConcierto(){
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql('SELECT id_con as conci FROM concieto',[],function(tx,results){
				var registros = results.rows.length;
				
				var conci  = results.rows[0].conci;
				
				$('#num_evento').val(conci);
				
				$('#botonReporte').html('\
					<a href="#" onclick = "window.open(\'http://www.ticketfacil.ec/ticket2/seguridad/reporte.php?id_con='+conci+'\',\'_blank\')">\
						<i class="material-icons" >contact_mail</i>reporte de ingresos\
					</a>\
					');
				<!-- alert(conci); -->
			},errorCB,successCB);
		});
	}
	function bajarTodas(){
		$('#mensajeConteo').html('<center><b>Espere un momento sincronizando su app!!!</b></center>');
		$('#ingBarcode').attr('disabled',true);
		$('#ingBarcode').attr('readonly',true);
		
		var idcon=$('#myidconcierto').val();
		var nom_empleado=$('#nom_empleado').val();
		var perfil_empleado=$('#perfil_empleado').val();
		
		var tipoRuta = 1;
		
		if(perfil_empleado == 'lectora' ){
			tipoRuta = 1;
		}else{
			tipoRuta = 2;
			bajaDescuentos(idcon);
		}
		var nn = $("input[name='locales_check[]']:checked").length;
		
		var mm=0;
		 $("input[name='locales_check[]']:checked").each(function() { 
			var localidad = $(this).val(); 
			var idconcierto=$('#myidconcierto').val();
			$('.la_localidad_'+localidad).addClass('danger');
			//alert(idconcierto +'<<>>'+localidad);
			$('#bajarTodas22').removeClass('btn btn-info');
			$('#bajarTodas22').addClass('btn btn-danger');
			$('#bajarTodas22').attr('disabled',true);
			$('#waitsubir4').css('display','block');
			var base = 1;
			if(tipoRuta == 2){
				var url1 = "https://www.ticketfacil.ec/ticket2/controlAccesos/bajarMovil_fabricio3.php?idconcierto="+idconcierto+"&base="+base+'&localidad='+localidad
			}else{
				var url1 = "https://www.ticketfacil.ec/ticket2/controlAccesos/bajarMovil_fabricio4.php?idconcierto="+idconcierto+"&base="+base+'&localidad='+localidad
			}
			$.ajax({
				 
				url : url1,
				//data: {idconcierto:idconcierto,localidad:localidad},
			}).done(function(response) {
				
				
				//alert(response);
				if(response != 'error'){
					var objDatos=JSON.parse(response);
					var misboletos=objDatos.Boletos;
					console.log(misboletos.length);
					var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
					db.transaction(function(tx){
						for(i=0; i < misboletos.length; i++){
							if(tipoRuta = 2){
								var id = misboletos[i].idBoleto; 
								var barcode = misboletos[i].barcode;
								var estado = misboletos[i].estado;
								var id_loc = misboletos[i].id_loc;
								var id_desc = misboletos[i].id_desc;
								var valor = misboletos[i].valor;
								var identComprador=2;
								tx.executeSql("INSERT OR IGNORE INTO Boleto (idBoleto ,nom_empleado,strQr,strBarcode,idLocB,strEstado,identComprador,valor) VALUES (?,?,?,?,?,?,?,?)",[id,nom_empleado,id_desc,barcode,id_loc,estado,identComprador,valor]);
								
								tx.executeSql('UPDATE Boleto SET  identComprador = ?, strQr = ? , valor = ? WHERE idBoleto = ?;',[identComprador,id_desc,valor,id]);
							}else{
								var id = misboletos[i].idBoleto; 
								var barcode = misboletos[i].barcode;
								var estado = misboletos[i].estado;
								var id_loc = misboletos[i].id_loc;
								
								var identComprador=2;
								
								tx.executeSql("INSERT OR IGNORE INTO Boleto (idBoleto ,nom_empleado,strBarcode,idLocB,strEstado,identComprador) VALUES (?,?,?,?,?,?)",[id,nom_empleado,barcode,id_loc,estado,identComprador]);
							}
							
							
						}
						$('.la_localidad_'+localidad).removeClass('danger');
						$('.la_localidad_'+localidad).addClass('info');
						
						mm++;
						
						console.log('seleccionados : ' + nn + ' bajadas : ' + mm );
						if(mm == nn){
							setTimeout(function(){
								alert('Localidades bajadas con éxito')
								$('#waitsubir2').css('display','none');
								window.location = '';
							}, 10000);
						}

					},errorCB,successCB);
					//$('#recibeJson').html(response);
					//alert(response);
					$('#waitbajar').fadeOut('slow');
					$('#btnbajar').delay(600).fadeIn('slow');
					
					
					<!-- $('#myidconcierto').val(''); -->
					<!-- $('#clave_segura').val(''); -->
				} 
				
				// setTimeout(function(){
					// alert('Localidades bajadas con éxito')
					// $('#waitsubir2').css('display','none');
					// window.location = '';
				// }, 20000);

			});
			
			
		});
	}


	function bajarTodasEspeciales(){
		var idcon=$('#myidconcierto').val();
		
		 
			<!-- var localidad = $(this).val(); -->
			var idconcierto=$('#myidconcierto').val();
			//alert(idconcierto +'<<>>'+localidad);
			$('#bajarTodas22').removeClass('btn btn-info');
			$('#bajarTodas22').addClass('btn btn-danger');
			$('#bajarTodas22').attr('disabled',true);
			$('#waitsubir4').css('display','block');
			var base = 1;
			$('#mensajeConteo').html('<center><img src="../img/loading.gif" style="max-width:25px;"></center>');
			$.ajax({
				url: "https://www.ticketfacil.ec/ticket2/controlAccesos/bajarTodasEspeciales.php?idconcierto="+idconcierto+"&base="+base,
				//data: {idconcierto:idconcierto,localidad:localidad},
			}).done(function(response) {
				
				
				<!-- alert(response); -->
				if(response != 'error'){
					var objDatos=JSON.parse(response);
					var misboletos=objDatos.Boletos;
					console.log(misboletos.length);
					var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
					db.transaction(function(tx){
						for(i=0; i < misboletos.length; i++){
							var id = misboletos[i].idBoleto; 
							var idBoleto = misboletos[i].idBoleto;
							var cedula = misboletos[i].cedula;
							var id_descuento = misboletos[i].id_descuento;
							var nom_empleado = misboletos[i].nom_empleado;
							
							var estado2 = 'V';
							
							<!-- alert('UPDATE Boleto SET idCli = '+cedula+' , strEstado= '+estado2+'  WHERE idBoleto = '+idBoleto+' ;'); -->
							tx.executeSql('UPDATE Boleto SET nom_empleado = ? , idCli = ? , id_descuento = ? , strEstado= ?  WHERE idBoleto = ? ;',[nom_empleado , cedula,id_descuento,estado2,idBoleto]);
						}
						
						alert('Tickets Especiales Actualizados con Exito');
						$('#waitsubir2').css('display','none');
						window.location = '';
					},errorCB,successCB);
					//$('#recibeJson').html(response);
					//alert(response);
					$('#waitbajar').fadeOut('slow');
					$('#btnbajar').delay(600).fadeIn('slow');
					
					
					<!-- $('#myidconcierto').val(''); -->
					<!-- $('#clave_segura').val(''); -->
				} 
				
				<!-- setTimeout(function(){ -->
					
				<!-- }, 10000); -->
				
			});
			
			
			
		
	}

	function bajaDescuentos(id){
		$.ajax({
			url: "https://www.ticketfacil.ec/ticket2/controlAccesos/bajarMovil_descuentos.php?idconcierto="+id,
			//data: {idconcierto:idconcierto,localidad:localidad},
		}).done(function(response) {
			
			
			//alert(response);
			if(response != 'error'){
				var objDatos=JSON.parse(response);
				var descu=objDatos.descuentos;
				console.log(descu.length);
				
				var id_Desc = 0;
				var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
				db.transaction(function(tx){
				
					for(i=0; i < descu.length; i++){
						var id = descu[i].id; 
						var nom = descu[i].nom;
						var val = descu[i].val;
						var id_loc = descu[i].id_loc;
						if(id == 0 ){
							id_Desc = (id+id_loc+id);
							console.log(' viene un 0 ' + id_Desc);
						}else{
							id_Desc = id;
						}
						var tipo = 0;
						tx.executeSql("INSERT OR IGNORE INTO descuentos (id_desc,nombre,precio,localidad,tipo) VALUES (?,?,?,?,?)",[id_Desc,nom,val,id_loc,tipo]);
					
						<!-- tx.executeSql('UPDATE descuentos SET nombre = ?,precio= ? , localidad = ? WHERE id_desc = ?;',[nom,val,localidad,id]); -->
						
					}
				},errorCB,successCB);
				
			} 
			
			
			
		});
	}
	function selectAll(){
		if($('#chk_all').is(':checked')){
			$('.locales_check').prop('checked',true);
		}else{
			$('.locales_check').prop('checked',false);
		}
	}
	conteo_boletos();
	function conteo_boletos(){
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql("SELECT count(idBoleto) as no_vendidos ,strEstado FROM Boleto where strEstado = 'A';",[],function(tx,results){
				console.log(results);
				// var registros_no_vendidos = results.items.length;
				var no_vendidos  = results.rows[0].no_vendidos;
				// alert(no_vendidos)
				
				$('#no_ingresados').val(no_vendidos);
				$('.no_ingresados').val(no_vendidos);
				
			});
		},errorCB,successCB);
		
		
		
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql("SELECT count(idBoleto) as vendidos ,strEstado FROM Boleto where strEstado ='I';",[],function(tx,results){
				console.log(results);
				// var registros_no_vendidos = results.items.length;
				var vendidos  = results.rows[0].vendidos;
				//var datos = '';
				
				$('#ingresados').val(vendidos);
				$('.ingresados').val(vendidos);
				
			});
		},errorCB,successCB);
		
		
		
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql("SELECT count(idBoleto) as no_vendidos_r FROM Boleto where strEstado ='ANU' and documentoHISB IS NULL",[],function(tx,results){
				console.log(results);
				// var registros_no_vendidos = results.items.length;
				var no_vendidos_r  = results.rows[0].no_vendidos_r;
				//var datos = '';
				
				$('#no_ingresados_R').val(no_vendidos_r);
				$('.no_ingresados_R').val(no_vendidos_r);
				
			});
		},errorCB,successCB);
		
		
		
		
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql("SELECT count(idBoleto) as vendidos_r ,strEstado FROM Boleto where documentoHISB = 'I' and strEstado ='ANU';",[],function(tx,results){
				console.log(results);
				// var registros_no_vendidos = results.items.length;
				var vendidos_r  = results.rows[0].vendidos_r;
				//var datos = '';
				
				$('#ingresados_R').val(vendidos_r);
				$('.ingresados_R').val(vendidos_r);
				
			});
		},errorCB,successCB);
		
		
		
		
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql("SELECT count(id) as cuantos_usados FROM errores where estado = '1' ",[],function(tx,results){
				console.log(results);
				// var registros_no_vendidos = results.items.length;
				var cuantos_usados  = results.rows[0].cuantos_usados;
				//var datos = '';
				
				$('#conteoUsados').html(cuantos_usados);
				
			});
		},errorCB,successCB);
		
		
		
		
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql("SELECT count(id) as cuantos_incorrecto FROM errores where estado = '2' ",[],function(tx,results){
				console.log(results);
				// var registros_no_vendidos = results.items.length;
				var cuantos_incorrecto  = results.rows[0].cuantos_incorrecto;
				//var datos = '';
				
				$('#conteoIncorrectos').html(cuantos_incorrecto);
				
			});
		},errorCB,successCB);
	}


	ver_localidades_bajadas();
	function ver_localidades_bajadas(){
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql('SELECT l.nombre as nombreL , count(idBoleto) as cuantos , l.id_loc as localidad FROM Boleto as b , localidad as l where b.idLocB = l.id_loc and b.strEstado <> "ANU" group by l.id_loc;',[],function(tx,results){
				var registro = results.rows.length;
				//alert(registro);
				var datos = '';
				var tr = '';
				var sumaCuantos = 0; 
				tr += '<tr  ><th>Localidades Bajadas:</th></tr>';
				var anulado = 'ANU';
				var mm=0;
				for(var j = 0; j < registro; j++){
				
					var row1 = results.rows.item(j);
					var nombreL = row1.nombreL;
					var cuantos = row1.cuantos;
					var localidad = row1.localidad;
					<!-- var cuantos2=''; -->
					<!-- db.transaction(function(tx){ -->
						<!-- alert("SELECT count(idBoleto) as cuantos2 FROM Boleto as b where b.idLocB = "+localidad+" and strEstado = '"+anulado+"';"); -->
						
					<!-- },errorCB,successCB); -->
					
					//alert('<<>>'+ nombreL);
					tr += '	<tr class = "localidadesBajadas" >\
						<td>\
							'+nombreL+' <div id = "saberAnulados_'+localidad+'"></div> </td>\
						<td style = "text-align:center;">\
							'+cuantos+' <input type = "hidden" class = "cuantos" value = "'+cuantos+'"  />\
						</td>\
					</tr>';
					sumaCuantos = (parseInt(sumaCuantos) + parseInt(cuantos));
					<!-- alert(cuantos + ' ' + sumaCuantos); -->
					mm++;
				}
				
				tr += '	<tr style = "display:none;">\
							<td style = "color:red;">\
								Total\
							</td>\
							<td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 20px">\
								'+sumaCuantos+'\
								<input type = "text" value = "'+sumaCuantos+'" id = "sumaCuantos" />  \
							</td>\
						</tr>';
				$('#titulo3').html(tr);
				
			},errorCB,successCB);
		});
		
		
		
		
		
		
		
		
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql('SELECT l.nombre as nombreL , count(idBoleto) as cuantos2 , l.id_loc as localidad FROM Boleto as b , localidad as l where b.idLocB = l.id_loc and b.strEstado = "ANU" group by l.id_loc;',[],function(tx,results2){
				var registro2 = results2.rows.length;
				//alert(registro);
				var datos = '';
				var tr2 = '';
				var sumaCuantos2 = 0; 
				var anulado = 'ANU';
				var mm=0;
				for(var k = 0; k < registro2; k++){
				
					var row2 = results2.rows.item(k);
					var nombreL = row2.nombreL;
					var cuantos2 = row2.cuantos2;
					var localidad = row2.localidad;
					<!-- alert('#saberAnulados_'+localidad+'') -->
					$('#saberAnulados_'+localidad+'').css('color','red')
					$('#saberAnulados_'+localidad+'').html('Esta localidad tiene : ' + cuantos2 + '  Tickets reimpresos' )
					sumaCuantos2 = (parseInt(sumaCuantos2) + parseInt(cuantos2));
				}
				
				tr2 += '	<tr style = "display:none;">\
							<td style = "color:red;">\
								Total\
							</td>\
							<td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 20px">\
								'+sumaCuantos2+'\
								<input type = "text" value = "'+sumaCuantos2+'" id = "sumaCuantos2" />  \
							</td>\
						</tr>';
				$('#titulo4').html(tr2);
				setTimeout(function(){
					var suma1 = $('#sumaCuantos').val()
					var suma2 = $('#sumaCuantos2').val()
					<!-- alert(parseInt(suma1) +'+'+ parseInt(suma2)) -->
					var suma3 = (parseInt(suma1) + parseInt(suma2));
					$('#titulo5').html('<tr><td style = "color:red;">Total</td><td style= "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 20px">'+suma3+'</td></tr>');
				}, 2000);
				
			},errorCB,successCB);
		});
		
		
	}
	ver_boletos_vs_localidad();
	function ver_boletos_vs_localidad(){
		
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql('select count(b.idBoleto) as cuantos , l.nombre as nom_localidad from Boleto as b , localidad as l where l.id_loc = b.idLocB and (b.strEstado = "I" or b.documentoHISB = "I" ) group by b.idLocB;',[],function(tx,results){
				var registro = results.rows.length;
				//alert(registro);
				var datos = '';
				var tr = '';
				var sumaCuantos = 0; 
				tr += '<tr  ><th colspan = "2" >Tickets ingresados</th></tr>';
				var anulado = 'ANU';
				var mm=0;
				for(var j = 0; j < registro; j++){
				
					var row1 = results.rows.item(j);
					var nom_localidad = row1.nom_localidad;
					var cuantos = row1.cuantos;
					
					<!-- var cuantos2=''; -->
					<!-- db.transaction(function(tx){ -->
						<!-- alert("SELECT count(idBoleto) as cuantos2 FROM Boleto as b where b.idLocB = "+localidad+" and strEstado = '"+anulado+"';"); -->
						
					<!-- },errorCB,successCB); -->
					
					//alert('<<>>'+ nombreL);
					tr += '	<tr class = "localidadesBajadas" >\
						<td>\
							'+nom_localidad+'</td>\
						<td style = "text-align:center;">\
							'+cuantos+'\
						</td>\
					</tr>';
					sumaCuantos = (parseInt(sumaCuantos) + parseInt(cuantos));
					<!-- alert(cuantos + ' ' + sumaCuantos); -->
					mm++;
				}
				
				tr += '	<tr style = "display:;">\
							<td style = "color:red;">\
								Total\
							</td>\
							<td style = "background-color: #171A1B;color: #1E9F75;text-align:center; font-size: 20px">\
								'+sumaCuantos+'\
							</td>\
						</tr>';
				$('#boletos_entrados').html(tr);
				
			},errorCB,successCB);
		});
		
		
	}
	//$( document ).ready(function() {
		
		<!-- setTimeout(function(){ -->
		<!-- var top = $('#titulo3').height(); -->
		<!-- //	alert(top); -->
			<!-- $( "html, body " ).animate({ -->
				<!-- scrollTop: top, -->
			<!-- },1500,function(){}); -->
		<!-- }, 1000); -->
		
	//});


	function borrarBase(){
		
		if(confirm('Esta seguro que desea borrar la base!!!')){
			$('#borraBase').html('Espere... Borrando la base!!!')
			var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql("SELECT * FROM Boleto where strEstado != 'A';",[],function(tx,results){
					var registros = results.rows.length;
					if(registros == 0){
						alert('no hay boletos por sincronizar');
						var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
						db.transaction(function(tx){
							tx.executeSql('DELETE FROM Boleto;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM localidad;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM concieto;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM descuentos;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM empleado;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM tickets_entregados;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM errores;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM auditoria;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM facturas;',[],function(tx,results){},errorCB,successCB);
							
							tx.executeSql('delete from sqlite_sequence',[],function(tx,results){},errorCB,successCB);
							
							
							
						});
						
						setTimeout(function(){
							alert('se ha borrado la informacion');
							logout();
						}, 2500);
					}else{
						alert('SE PROCEDERA A BORRAR LA BASE DE DATOS , \n ESTE PROCESO ES IRREVERSIBLE');
						var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
						db.transaction(function(tx){
							tx.executeSql('DELETE FROM Boleto;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM localidad;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM concieto;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM descuentos;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM empleado;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM tickets_entregados;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('delete from sqlite_sequence',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM errores;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM facturas;',[],function(tx,results){},errorCB,successCB);
							tx.executeSql('DELETE FROM auditoria;',[],function(tx,results){},errorCB,successCB); 
						});
						
						setTimeout(function(){
							alert('se ha borrado la informacion');
							logout();
						}, 2500);
					}
				},errorCB,successCB);
			});
		}else{
			alert('se aguevo');
		}
	}
	ver_concierto();
	function ver_concierto(){
	//	alert('hola');
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql('SELECT * FROM concieto group by id_con;',[],function(tx,results){
				var registro = results.rows.length;
				//alert(registro);
				var datos = '';
				for(var j = 0; j < registro; j++){
					var row1 = results.rows.item(j);
					var id_con = row1.id_con;
					var nombre_c = row1.nombre_c;
					//alert(id_con +'<<>>'+ nombre_c);
					$('#tituloEvento').html('LOCALIDADES EVENTO : ' + nombre_c);
					$('#titulo2').html('EVENTO : ' + nombre_c);
					$('.numero_evento').val(id_con);
				}
				
			},errorCB,successCB);
		});
	}


	function ver_localidades(){
		var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql('SELECT * FROM localidad group by id_loc;',[],function(tx,results){
				var registros = results.rows.length;
				var datos = '';
				
				for(var i = 0; i < registros; i++){
					
					var row = results.rows.item(i);
					var id_loc = row.id_loc;
					var nombre = row.nombre;
					$('#cuerpo_localidades').append('<tr class = "la_localidad_'+id_loc+'" ><td><input type = "checkbox" class = "locales_check" name="locales_check[]" value = "'+id_loc+'"   /></td><td>'+id_loc+'</td><td>'+nombre+'</td></tr>');
				}
				
			},errorCB,successCB);
		});
	}
	$(document).ready(function(){
	//ver_concierto();
	ver_localidades();
	$('#codigo').focus();

	});

	function selectmenu(data){
		if(data == 1){
			$('.menu').fadeOut('slow');
			$('.solocodigo').delay(600).fadeIn('slow');
		}else{
			$('.menu').fadeOut('slow');
			$('.cedulacodigo').delay(600).fadeIn('slow');
		}
	}

	function saltar(e){
		if(e.which == 13){
			$('#cedula').focus();
		}
	}

	function logout(){
		window.location = '../index.html'; 
	}

	

	function sincroniza(){
		var base = 1;
		var detectorInternet = $('#detectorInternet').val();
		if(detectorInternet == 1){
			var servi = '';
			var idcon=$('#myidconcierto').val();
			var nom_empleado=$('#nom_empleado').val();
			var perfil_empleado=$('#perfil_empleado').val();
			if(perfil_empleado == 'cajero' ){
				var db = window.openDatabase("Database", "1.0", "TicketMobile", 200000);
				db.transaction(function(tx){
					tx.executeSql("SELECT  strBarcode , idCli  , idBoleto , id_descuento from Boleto where idCli > 0 ",[],function(tx,results){
						var registro = results.rows.length;
						<!-- alert(registro); -->
						if(registro > 0){
							$('#mensajeConteo').html('<center><img src="../img/loading.gif" style="max-width:25px;"></center>');
							$('#btnbajar22').html('espere sincronizando')
							for(var j = 0; j < registro; j++){
								var row1 = results.rows.item(j);
								var strBarcode = row1.strBarcode;
								var idCli = row1.idCli;
								var idBoleto = row1.idBoleto;
								var id_descuento = row1.id_descuento;
								
								servi += idcon +'@'+ strBarcode +'@'+ idCli +'@'+ idBoleto +'@'+id_descuento+'|';
								
							}
							var serviform = servi.substring(0,servi.length - 1);
							<!-- alert(serviform) -->
							$.ajax({
								url: "https://www.ticketfacil.ec/ticket2/controlAccesos/subeTicketsEspeciales.php?serviform="+serviform+'&base='+base+'&nom_empleado='+nom_empleado,
								//data: {idconcierto:idconcierto,localidad:localidad},
							}).done(function(response) {
								<!-- alert(response) -->
								setInterval(function () { 
									bajarTodasEspeciales();
								}, 3000);
								
							});
						}else{
							bajarTodasEspeciales();
						}
						
					},errorCB,successCB);
				});
			}else{
				alert('no es cajero');
			}
		}else{
			alert('no tiene conexion a internet , verifique y vuelva a intentarlo');
			location.reload();
		}
	}


	setInterval(function () { 
		sincroniza(); 
	}, 6000000);

