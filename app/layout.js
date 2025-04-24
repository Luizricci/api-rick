import "../styles/globals.css";
			export const metadata = {
				title: "Rick and Morty App",
			};
			export default function RootLayout({ children }) {
				return (
					<html>
						<head>
							<link rel="icon" href="/Rick_sanches.png" />
						</head>
						<body>{children}</body>
					</html>
);
		}
