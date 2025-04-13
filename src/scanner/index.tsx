import Quagga from "@ericblade/quagga2";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Result from "./Result";
import Scanner from "./scanner";

const BarcodeScanner = () => {
	const [scanning, setScanning] = useState(false); // toggleable state for "should render scanner"
	const [cameras, setCameras] = useState([]); // array of available cameras, as returned by Quagga.CameraAccess.enumerateVideoDevices()
	const [cameraId, setCameraId] = useState(null); // id of the active camera device
	const [cameraError, setCameraError] = useState(null); // error message from failing to access the camera
	const [results, setResults] = useState<any>([]); // list of scanned results
	const [torchOn, setTorch] = useState(false); // toggleable state for "should torch be on"
	const scannerRef = useRef(null); // reference to the scanner element in the DOM

	// at start, we need to get a list of the available cameras.  We can do that with Quagga.CameraAccess.enumerateVideoDevices.
	// HOWEVER, Android will not allow enumeration to occur unless the user has granted camera permissions to the app/page.
	// AS WELL, Android will not ask for permission until you actually try to USE the camera, just enumerating the devices is not enough to trigger the permission prompt.
	// THEREFORE, if we're going to be running in Android, we need to first call Quagga.CameraAccess.request() to trigger the permission prompt.
	// AND THEN, we need to call Quagga.CameraAccess.release() to release the camera so that it can be used by the scanner.
	// AND FINALLY, we can call Quagga.CameraAccess.enumerateVideoDevices() to get the list of cameras.

	// Normally, I would place this in an application level "initialization" event, but for this demo, I'm just going to put it in a useEffect() hook in the App component.

	useEffect(() => {
		const init = async () => {
			const enableCamera = async () => {
				await Quagga.CameraAccess.request(null, {});
			};
			const disableCamera = async () => {
				await Quagga.CameraAccess.release();
			};
			const enumerateCameras = async () => {
				const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
				console.log("Cameras Detected: ", cameras);

				return cameras;
			};
			enableCamera()
				.then(disableCamera)
				.then(enumerateCameras)
				.then((cameras: any) => setCameras(cameras))
				.then(() => Quagga.CameraAccess.disableTorch()) // disable torch at start, in case it was enabled before and we hot-reloaded
				.catch((err: any) => setCameraError(err));
		};

		init();

		const disableCameraUnmount = () => {
			Quagga.CameraAccess.release();
		};

		return disableCameraUnmount();
	}, []);

	// provide a function to toggle the torch/flashlight
	const onTorchClick = useCallback(() => {
		const torch = !torchOn;
		setTorch(torch);
		if (torch) {
			Quagga.CameraAccess.enableTorch();
		} else {
			Quagga.CameraAccess.disableTorch();
		}
	}, [torchOn, setTorch]);

	const onSelectChange = useCallback((event: any) => {
		setCameraId(event.target.value);
	}, []);

	const onToggleScanning = useCallback(() => {
		setScanning(!scanning);
	}, [scanning]);

	const onObjectDetected = useCallback(
		(result: any) => {
			setResults([...results, result]);
		},
		[results]
	);

	console.log("result", results)

	return (
		<div>
			{cameraError ? (
				<p>ERROR INITIALIZING CAMERA ${JSON.stringify(cameraError)} -- DO YOU HAVE PERMISSION?</p>
			) : null}
			{cameras.length === 0 ? (
				<p>Enumerating Cameras, browser may be prompting for permissions beforehand</p>
			) : (
				<form>
					<select onChange={onSelectChange}>
						{cameras.map((camera: any) => (
							<option key={camera.deviceId} value={camera.deviceId}>
								{camera.label || camera.deviceId}
							</option>
						))}
					</select>
				</form>
			)}

			<button onClick={onTorchClick} type="button">
				{torchOn ? "Disable Torch" : "Enable Torch"}
			</button>

			<button onClick={onToggleScanning} type="button">
				{scanning ? "Stop" : "Start"}
			</button>

			<ul className="results">
				{results.map((result: any) => result.codeResult && <Result key={result.codeResult.code} result={result} />)}
			</ul>

			<div ref={scannerRef} className="canvas-scanner">
				{/* <video style={{ width: window.innerWidth, height: 480, border: '3px solid orange' }}/> */}
				<canvas className="drawingBuffer, scanner" height="480" width="640" />
				{scanning ? (
					<Scanner
						cameraId={cameraId}
						constraints={undefined}
						decoders={undefined}
						facingMode=""
						locate={undefined}
						locator={undefined}
						onDetected={onObjectDetected}
						onScannerReady={undefined}
						scannerRef={scannerRef}
					/>
				) : null}
			</div>
		</div>
	);
};

export default BarcodeScanner;
