import React from 'react';
import './PDFViewer.css';

const PDFViewer = ({ pdfPath, title, author }) => {
    return (
        <div className="pdf-viewer-container">
            <div className="pdf-viewer-header">
                <div className="pdf-viewer-title">
                    <span className="pdf-icon">📄</span>
                    <div className="pdf-title-text">
                        <h3>{title}</h3>
                        <p>By {author}</p>
                    </div>
                </div>
                <a 
                    href={pdfPath} 
                    download 
                    className="pdf-download-btn"
                    title="Download PDF"
                >
                    ⬇️ Download
                </a>
            </div>
            <div className="pdf-viewer-frame">
                <object 
                    data={pdfPath} 
                    type="application/pdf"
                    className="pdf-object"
                >
                    <div className="pdf-fallback">
                        <p>Unable to display PDF in browser.</p>
                        <a href={pdfPath} className="pdf-fallback-btn">
                            Click here to open PDF
                        </a>
                    </div>
                </object>
            </div>
            <div className="pdf-viewer-footer">
                <span className="pdf-hint">
                    💡 Use the toolbar above to zoom, navigate, or download
                </span>
            </div>
        </div>
    );
};

export default PDFViewer;
