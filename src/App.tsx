import React from "react";
import VinBarcodeScanner from "zxing";

const App: React.FC = () => {
	return (
		<div>
			<VinBarcodeScanner />
		</div>
	);
};

export default App;
