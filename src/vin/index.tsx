// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import Quagga from "quagga";
import React, { useCallback, useState } from "react";

const inputStreams = [
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

const getSize = (size: number) => {
	if (size < 640) {
		return 320;
	} else if (size < 800) {
		return 640;
	} else if (size < 1280) {
		return 800;
	} else if (size < 1600) {
		return 1280;
	} else if (size < 1920) {
		return 1600;
	} else {
		return 1920;
	}
};

const VinScanner = () => {
	const [scanResult, setScanResult] = useState(null);
	const [error, setError] = useState<string | null>(null);
	const [src, setSrc] = useState("");

	const decodeBarcode = useCallback((originalSize: number, dataUrl: string) => {
		console.log("size received... ", originalSize);

		let isDecoded = false;
		const size = getSize(originalSize);

		console.log("size updated... ", size);

		inputStreams.forEach((stream: string) => {
			console.log("trying with... ", stream);

			if (!isDecoded) {
				Quagga.decodeSingle(
					{
						src: dataUrl,
						numOfWorkers: 0,
						locate: false,
						patchSize: "large",
						inputStream: {
							size: size || 800
						},
						decoder: {
							readers: [stream]
						}
					},
					(result: any) => {
						if (result && result.codeResult) {
							isDecoded = true;
							setScanResult(result.codeResult.code);
						} else {
							setError("No barcode detected.");
						}
					}
				);
			}
		});

		console.log("is decoded", isDecoded);
	}, []);

	// Handle file input change event
	const handleFileChange = useCallback(
		(e: any) => {
			setScanResult(null);
			setError(null);
			setSrc("");

			const file = e.target.files[0];

			if (!file) {
				return;
			}

			const reader = new FileReader();

			reader.onload = (event: any) => {
				const image = new Image();
				const dataUrl = event.target.result;

				image.src = dataUrl;
				setSrc(dataUrl);

				image.onload = () => {
					const width = image.naturalWidth;
					const height = image.naturalHeight;
					const maxDimension = Math.max(width, height);

					decodeBarcode(maxDimension, dataUrl);
				};

				image.onerror = (error: any) => {
					console.error("Error loading image:", error);
				};
			};

			reader.onerror = () => {
				setError("Failed to read the file.");
			};

			reader.readAsDataURL(file);
		},
		[decodeBarcode]
	);

	return (
		<div className="vin-root">
			<h1>QuaggaJS Barcode Scanner</h1>

			<input accept="image/*" className="mb-20" onChange={handleFileChange} type="file" />

			{scanResult && (
				<div>
					<h2>Scan Result:</h2>
					<p>{scanResult}</p>
				</div>
			)}

			<div>{src && <img alt="preview" height={200} src={src} width={450} />}</div>

			{error && (
				<div className="error">
					<p>{error}</p>
				</div>
			)}
		</div>
	);
};

export default VinScanner;
