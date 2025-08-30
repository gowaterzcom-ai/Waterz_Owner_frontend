// components/Account/Account.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/store/hook';
import { clearUserDetails, updateUserDetails } from '../../redux/slices/userSlice';
import { ownerAPI } from '../../api/owner';
import styles from '../../styles/Account/Account.module.css';
import { PencilIcon } from 'lucide-react';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector((state) => state.user);

  const [isAccountTypeOpen, setIsAccountTypeOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  // const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userDetails?.name);
  const [phoneInput, setPhoneInput] = useState(userDetails.phone || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNameInput(userDetails.name);
    setPhoneInput(userDetails.phone || '');
  }, [userDetails]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    dispatch(clearUserDetails());
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setNameInput(userDetails.name);
    setPhoneInput(userDetails.phone || '');
  };

  const handleSave = async () => {
    try {
      // @ts-ignore
      const updatedProfile = await ownerAPI.updateProfile(phoneInput, nameInput );
      console.log("updated profile", updatedProfile.user);
      dispatch(updateUserDetails(updatedProfile.user));
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Account</h1>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Personal Details</h2>
          {!isEditing && (
            // Clicking the pencil icon or this button toggles edit mode
            <div className={styles.editButton} onClick={handleEdit}><PencilIcon/></div>
          )}
        </div>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Name:</span>
            {isEditing ? (
              <input 
                className={styles.inputField} 
                type="text" 
                value={nameInput} 
                onChange={(e) => setNameInput(e.target.value)} 
              />
            ) : (
              <span className={styles.value}>{userDetails.name}</span>
            )}
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Phone Number:</span>
            {isEditing ? (
              <input 
                className={styles.inputField} 
                type="text" 
                value={phoneInput} 
                onChange={(e) => setPhoneInput(e.target.value)} 
              />
            ) : (
              <span className={styles.value}>{userDetails.phone || ''}</span>
            )}
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Email Id:</span>
            <span className={styles.value}>{userDetails.email}</span>
          </div>
        </div>
        {isEditing && (
          <div className={styles.editActions}>
            <button className={styles.saveButton} onClick={handleSave}>Save</button>
            <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </section>

      <section className={styles.section}>
        <div 
          className={styles.dropdownHeader}
          onClick={() => setIsAccountTypeOpen(!isAccountTypeOpen)}
        >
          <h2 className={styles.sectionTitle}>Account Type</h2>
          <span className={`${styles.arrow} ${isAccountTypeOpen ? styles.open : ''}`}>▼</span>
        </div>
        {isAccountTypeOpen && (
          <div className={styles.dropdownContent}>
            <p>{userDetails.role || 'Customer'}</p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div 
          className={styles.dropdownHeader}
          onClick={() => setIsTermsOpen(!isTermsOpen)}
        >
          <h2 className={styles.sectionTitle}>Terms & Conditions</h2>
          <span className={`${styles.arrow} ${isTermsOpen ? styles.open : ''}`}>▼</span>
        </div>
        {isTermsOpen && (
          <div className={styles.dropdownContent}>
            <p>Our terms and conditions...</p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div 
          className={styles.dropdownHeader}
          onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
        >
          <h2 className={styles.sectionTitle}>Security & Privacy Policy</h2>
          <span className={`${styles.arrow} ${isPrivacyOpen ? styles.open : ''}`}>▼</span>
        </div>
        {isPrivacyOpen && (
          <div className={styles.dropdownContent}>
            <p>Our privacy policy...</p>
          </div>
        )}
      </section>

      {/* <section className={styles.section}>
        <div 
          className={styles.dropdownHeader}
          onClick={() => setIsHelpOpen(!isHelpOpen)}
        >
          <h2 className={styles.sectionTitle}>Help & Contact Us</h2>
          <span className={`${styles.arrow} ${isHelpOpen ? styles.open : ''}`}>▼</span>
        </div>
        {isHelpOpen && (
          <div className={styles.dropdownContent}>
            <p>Contact support at support@example.com</p>
          </div>
        )}
      </section> */}

      <button 
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default Account;