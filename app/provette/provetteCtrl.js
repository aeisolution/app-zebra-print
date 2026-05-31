// app/provette/provetteCtrl.js
// Controller di prova per stampa etichette provette su Zebra ZD421.
// Etichetta standard: 5,3 x 3 cm (53 x 30 mm). A 203 dpi = 8 dot/mm
// -> larghezza 424 dot, altezza 240 dot.

(function () {
	'use strict';

	angular.module('appProvette', ['toastr'])
		.controller('provetteCtrl', ['toastr', provetteCtrl]);

	function provetteCtrl(toastr) {
		var vm = this;

		// ============================================================
		// Dati provetta (campi compilati dall'operatore)
		// ============================================================
		vm.dati = {
			codice: '',           // codice accettazione (barcode)
			cognome: '',          // cognome proprietario
			specie: '',           // specie animale
			nome: '',             // nome animale
			tipologia: '',        // tipologia campione
			data: ''              // data accettazione (dd/MM/yyyy)
		};

		vm.tipologie = ['Siero', 'Emocromo', 'Urine', 'Coagulazione', 'Feci', 'Liquor', 'Tampone', 'Altro'];

		// ============================================================
		// Configurazione layout (tutti i valori in DOT salvo dpmm/mm)
		// Default per ZD421 @ 203 dpi (8 dpmm), etichetta 53x30 mm.
		// ============================================================
		vm.cfg = {
			labelWmm: 53,
			labelHmm: 30,
			dpmm: 8,              // 8 = 203 dpi, 12 = 300 dpi
			darkness: 15,         // 0-30, opzionale
			copie: 1,

			barcode: {
				x: 10, y: 8,
				moduleWidth: 2,   // ^BY larghezza modulo
				height: 50,       // altezza dot
				humanReadable: true,
				type: 'C'         // 'C' = Code128, '3' = Code39, '2' = Interleaved 2of5
			},

			// Per ogni riga di testo: x, y, fontH (altezza), fontW (larghezza)
			testoCodice:   { x: 10,  y: 70,  fontH: 22, fontW: 12, mostra: true,  prefix: '' },
			cognome:       { x: 10,  y: 100, fontH: 22, fontW: 12, mostra: true,  prefix: '' },
			specieNome:    { x: 10,  y: 130, fontH: 18, fontW: 10, mostra: true,  prefix: '' },
			tipologia:     { x: 10,  y: 160, fontH: 22, fontW: 12, mostra: true,  prefix: '' },
			data:          { x: 10,  y: 195, fontH: 18, fontW: 10, mostra: true,  prefix: '' }
		};

		// Dimensioni calcolate in dot dalle dimensioni in mm (read-only)
		Object.defineProperty(vm, 'labelW', { get: function () { return vm.cfg.labelWmm * vm.cfg.dpmm; } });
		Object.defineProperty(vm, 'labelH', { get: function () { return vm.cfg.labelHmm * vm.cfg.dpmm; } });

		// ============================================================
		// Zebra Printer setup
		// ============================================================
		vm.selected_device = null;
		vm.devices = [];

		vm.zplPreview = '';

		vm.Zebra_setup = Zebra_setup;
		vm.generaZpl = generaZpl;
		vm.stampa = stampa;
		vm.resetDefault = resetDefault;

		// activate
		Zebra_setup();
		generaZpl();

		// ============================================================
		// Metodi
		// ============================================================
		function Zebra_setup() {
			if (typeof BrowserPrint === 'undefined') {
				console.log('BrowserPrint non caricato');
				return;
			}
			BrowserPrint.getDefaultDevice('printer',
				function (device) {
					vm.selected_device = device;
					if (device) vm.devices.push(device);
					BrowserPrint.getLocalDevices(function (list) {
						for (var i = 0; i < list.length; i++) {
							if (!vm.selected_device || list[i].uid !== vm.selected_device.uid) {
								vm.devices.push(list[i]);
							}
						}
						// forza apply Angular (callback fuori dal digest)
						safeApply();
					}, function () {
						toastr.error('Errore nel recupero stampanti locali');
					}, 'printer');
					safeApply();
				},
				function (err) {
					toastr.warning('Stampante non trovata: ' + (err || ''));
				}
			);
		}

		function resetDefault() {
			vm.cfg = {
				labelWmm: 53, labelHmm: 30, dpmm: 8, darkness: 15, copie: 1,
				barcode:     { x: 10, y: 8,   moduleWidth: 2, height: 50, humanReadable: true, type: 'C' },
				testoCodice: { x: 10, y: 70,  fontH: 22, fontW: 12, mostra: true, prefix: '' },
				cognome:     { x: 10, y: 100, fontH: 22, fontW: 12, mostra: true, prefix: '' },
				specieNome:  { x: 10, y: 130, fontH: 18, fontW: 10, mostra: true, prefix: '' },
				tipologia:   { x: 10, y: 160, fontH: 22, fontW: 12, mostra: true, prefix: '' },
				data:        { x: 10, y: 195, fontH: 18, fontW: 10, mostra: true, prefix: '' }
			};
			generaZpl();
		}

		// Costruisce il comando ZPL e lo salva in vm.zplPreview
		function generaZpl() {
			var d = vm.dati;
			var c = vm.cfg;

			var zpl = '';
			zpl += '^XA';
			zpl += '^CI28';                                  // UTF-8
			zpl += '^PW' + vm.labelW;                        // print width
			zpl += '^LL' + vm.labelH;                        // label length
			zpl += '^LH0,0';                                 // origine
			if (typeof c.darkness === 'number') zpl += '^MD' + c.darkness;

			// Barcode + codice accettazione
			if (d.codice) {
				zpl += '^BY' + (c.barcode.moduleWidth || 2);
				zpl += '^FO' + c.barcode.x + ',' + c.barcode.y;
				zpl += '^B' + c.barcode.type + 'N,' + c.barcode.height + ',' +
				       (c.barcode.humanReadable ? 'Y' : 'N') + ',N';
				zpl += '^FD' + safeText(d.codice) + '^FS';
			}

			zpl += textField(c.testoCodice, d.codice);
			zpl += textField(c.cognome, d.cognome);
			zpl += textField(c.specieNome, joinNonEmpty([d.specie, d.nome], ' - '));
			zpl += textField(c.tipologia, d.tipologia);
			zpl += textField(c.data, d.data);

			zpl += '^PQ' + (c.copie || 1) + ',0,1,Y';
			zpl += '^XZ';

			vm.zplPreview = zpl;
			return zpl;
		}

		function stampa() {
			var zpl = generaZpl();

			if (!vm.dati.codice) {
				toastr.warning('Inserire almeno il codice accettazione');
				return;
			}
			if (!vm.selected_device) {
				toastr.error('Nessuna stampante selezionata');
				return;
			}
			vm.selected_device.send(zpl, function () {
				toastr.success('Etichetta inviata in stampa');
			}, function (err) {
				toastr.error('Errore di stampa: ' + (err || ''));
				safeApply();
			});
		}

		// ============================================================
		// Helpers
		// ============================================================
		function textField(cfgRiga, value) {
			if (!cfgRiga || !cfgRiga.mostra) return '';
			if (value === undefined || value === null || value === '') return '';
			var v = (cfgRiga.prefix || '') + value;
			return '^FO' + cfgRiga.x + ',' + cfgRiga.y +
			       '^A0N,' + cfgRiga.fontH + ',' + cfgRiga.fontW +
			       '^FD' + safeText(v) + '^FS';
		}

		function joinNonEmpty(arr, sep) {
			var out = [];
			for (var i = 0; i < arr.length; i++) if (arr[i]) out.push(arr[i]);
			return out.join(sep);
		}

		// ZPL: i caratteri ^ ~ \ e null vanno escapati con ^FH e _hex; per
		// caso d'uso semplice li sostituisco con spazio se presenti.
		function safeText(s) {
			return String(s).replace(/[\^~\\]/g, ' ');
		}

		function safeApply() {
			var scope = angular.element(document.body).scope();
			if (scope && !scope.$$phase && !scope.$root.$$phase) scope.$apply();
		}
	}
})();
