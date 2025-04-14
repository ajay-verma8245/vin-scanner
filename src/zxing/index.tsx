import { BrowserMultiFormatReader } from "@zxing/library";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useZxing } from "react-zxing";

const VinBarcodeScanner = () => {
	const [liveResult, setLiveResult] = useState("");
	const [metadata, setMetadata] = useState("");
	const [barcodeFormat, setBarcodeFormat] = useState("");

	const [fileResult, setFileResult] = useState("");
	const [fileError, setFileError] = useState("");

	// Get the ref (and torch controls if needed) from react-zxing.
	// The hook returns an object with "ref" and "torch".
	const { ref: zxingRef } = useZxing();

	// Also create our own video ref for clarity.
	const videoRef = useRef<any>(null);

	const setDetails = useCallback((result: any) => {
		setLiveResult(result.getText());
		setMetadata(JSON.stringify(result.getResultMetadata));
		setBarcodeFormat(JSON.stringify(result.getBarcodeFormat));
	}, []);

	// When the react-zxing ref is set, also assign it to our videoRef.
	useEffect(() => {
		if (zxingRef && zxingRef.current) {
			videoRef.current = zxingRef.current;
		}
	}, [zxingRef]);

	// Set up live video scanning using ZXing's decodeFromVideoElementContinuously.
	useEffect(() => {
		// Create a new instance for live scanning.
		const codeReader = new BrowserMultiFormatReader();

		if (videoRef.current) {
			// Start scanning continuously from the video element.
			codeReader.decodeFromVideoElementContinuously(videoRef.current, (result: any, error: any) => {
				if (result) {
					setDetails(result);
				}
				// You can optionally log or handle errors as needed.
			});
		}

		// Cleanup: reset the code reader when the component unmounts.
		return () => {
			codeReader.reset();
		};
	}, [setDetails, videoRef]);

	// Handler for file input changes.
	const handleFileChange = useCallback(
		async (event: any) => {
			setLiveResult("");
			setFileResult("");
			setFileError("");
			const file = event.target.files[0];
			if (!file) {
				return;
			}

			const reader = new FileReader();
			reader.onload = async (e: any) => {
				const imageUrl = e.target.result;
				// Create a new instance for image scanning (separate from the live stream).
				const codeReader = new BrowserMultiFormatReader();
				try {
					const result = await codeReader.decodeFromImageUrl(imageUrl);
					setFileResult(result.getText());
					setDetails(result);
				} catch (error) {
					console.error("Error decoding barcode from image:", error);
					setFileError("No barcode found or unable to decode the image.");
				}
			};
			reader.readAsDataURL(file);
		},
		[setDetails]
	);

	return (
		<div className="zxing-container">
			<h1>VIN Barcode Scanner with React-ZXing</h1>

			{/* Live stream barcode scanning section */}
			<section className="mb-40">
				<h2>Live Stream Scanner</h2>
				<p>Point your camera at a VIN barcode.</p>
				<video ref={videoRef} className="video">
					<track kind="captions" />
				</video>
				{liveResult && (
					<div className="mt-10">
						<strong>Scanned VIN:</strong> {liveResult}
					</div>
				)}
			</section>

			{/* File input barcode scanning section */}
			<section>
				<h2>File Input Scanner</h2>
				<p>Select an image file containing a VIN barcode.</p>

				<input accept="image/*" capture="environment" onChange={handleFileChange} type="file" />

				{fileResult && (
					<div>
						<div className="mt-10">
							<strong>Scanned VIN from Image:</strong> {fileResult}
						</div>
						<div className="mt-10">
							<strong>Barcode format:</strong> {barcodeFormat}
						</div>
						<div className="mt-10">
							<strong>MetaData format:</strong> {metadata}
						</div>
					</div>
				)}
				{fileError && <div className="error">{fileError}</div>}
			</section>
		</div>
	);
};

export default VinBarcodeScanner;
