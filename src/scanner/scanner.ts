/* eslint-disable no-promise-executor-return */
import Quagga from "@ericblade/quagga2";
import { useCallback, useLayoutEffect } from "react";

const getMedian = (arr: any) => {
	const newArr = [...arr]; // copy the array before sorting, otherwise it mutates the array passed in, which is generally undesireable
	newArr.sort((a: any, b: any) => a - b);
	const half = Math.floor(newArr.length / 2);
	if (newArr.length % 2 === 1) {
		return newArr[half];
	}

	return (newArr[half - 1] + newArr[half]) / 2;
};

const getMedianOfCodeErrors = (decodedCodes: any) => {
	const errors = decodedCodes.flatMap((x: any) => x.error);
	const medianOfErrors = getMedian(errors);

	return medianOfErrors;
};

const defaultConstraints = {
	width: 640,
	height: 480
};

const defaultLocatorSettings = {
	patchSize: "medium",
	halfSample: true,
	willReadFrequently: true
};

const defaultDecoders = [
	"code_128_reader ",
	"ean_reader",
	"ean_8_reader",
	"code_39_reader",
	"code_39_vin_reader",
	"codabar_reader",
	"upc_reader",
	"upc_e_reader",
	"i2of5_reader",
	"2of5_reader",
	"code_93_reader"
];

type IScannerProps = {
	onDetected: any;
	scannerRef: any;
	onScannerReady: any;
	cameraId: string | null;
	facingMode: string;
	constraints: any;
	locator: any;
	decoders: any;
	locate: any;
};

const Scanner = ({
	onDetected,
	scannerRef,
	onScannerReady,
	cameraId,
	facingMode,
	constraints = defaultConstraints,
	locator = defaultLocatorSettings,
	decoders = defaultDecoders,
	locate = true
}: IScannerProps) => {
	const errorCheck = useCallback(
		(result: any) => {
			if (!onDetected) {
				return;
			}
			const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
			// if Quagga is at least 75% certain that it read correctly, then accept the code.
			if (err < 0.25) {
				onDetected(result.codeResult.code);
			}
		},
		[onDetected]
	);

	const handleProcessed = (result: any) => {
		const drawingCtx = Quagga.canvas.ctx.overlay;
		const drawingCanvas = Quagga.canvas.dom.overlay;
		drawingCtx.font = "24px Arial";
		drawingCtx.fillStyle = "green";

		if (result && drawingCanvas) {
			// console.warn('* quagga onProcessed', result);
			const width = drawingCanvas.getAttribute("width") || "640";
			const height = drawingCanvas.getAttribute("height") || "480";
			if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(width, 10), parseInt(height, 10));
				result.boxes
					.filter((box: any) => box !== result.box)
					.forEach((box: any) => {
						Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "purple", lineWidth: 2 });
					});
			}
			if (result.box) {
				Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "blue", lineWidth: 2 });
			}
			if (result.codeResult && result.codeResult.code) {
				// const validated = barcodeValidator(result.codeResult.code);
				// const validated = validateBarcode(result.codeResult.code);
				// Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: validated ? 'green' : 'red', lineWidth: 3 });
				drawingCtx.font = "24px Arial";
				// drawingCtx.fillStyle = validated ? 'green' : 'red';
				// drawingCtx.fillText(`${result.codeResult.code} valid: ${validated}`, 10, 50);
				drawingCtx.fillText(result.codeResult.code, 10, 20);
				// if (validated) {
				//     onDetected(result);
				// }
			}
		}
	};

	useLayoutEffect(() => {
		// if this component gets unmounted in the same tick that it is mounted, then all hell breaks loose,
		// so we need to wait 1 tick before calling init().  I'm not sure how to fix that, if it's even possible,
		// given the asynchronous nature of the camera functions, the non asynchronous nature of React, and just how
		// awful browsers are at dealing with cameras.
		let ignoreStart = false;
		const init = async () => {
			// wait for one tick to see if we get unmounted before we can possibly even begin cleanup
			await new Promise((resolve: any) => setTimeout(resolve, 1));
			if (ignoreStart) {
				return;
			}
			// begin scanner initialization
			await Quagga.init(
				{
					inputStream: {
						type: "LiveStream",
						constraints: {
							...constraints,
							...(cameraId && { deviceId: cameraId }),
							...(!cameraId && { facingMode })
						},
						target: scannerRef.current,
						willReadFrequently: true
					},
					locator,
					decoder: { readers: decoders },
					locate
				},
				async (err: any) => {
					Quagga.onProcessed(handleProcessed);

					if (err) {
						console.error("Error starting Quagga:", err);
					} else if (scannerRef && scannerRef.current) {
						await Quagga.start();

						if (onScannerReady) {
							onScannerReady();
						}
					}
				}
			);
			Quagga.onDetected(errorCheck);
		};
		init();

		// cleanup by turning off the camera and any listeners
		return () => {
			ignoreStart = true;
			Quagga.stop();
			Quagga.offDetected(errorCheck);
			Quagga.offProcessed(handleProcessed);
		};
	}, [
		cameraId,
		onDetected,
		onScannerReady,
		scannerRef,
		errorCheck,
		constraints,
		locator,
		decoders,
		locate,
		facingMode
	]);

	return null;
};

export default Scanner;
