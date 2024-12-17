import PropTypes from 'prop-types';

function ImageUploader({ onImageAnalyze }) {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target.result;
        onImageAnalyze(base64Image, file);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
    }
  };

  return (
    <div className="image-uploader">
      <label htmlFor="image-input" className="upload-label">
        <div className="upload-content">
          <i className="upload-icon">📸</i>
          <span>Cliquez ou déposez une image de carte Pokémon</span>
        </div>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
      </label>
    </div>
  );
}

ImageUploader.propTypes = {
  onImageAnalyze: PropTypes.func.isRequired,
};

export default ImageUploader;
