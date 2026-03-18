import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import useClaimsStore from '../stores/claimsStore';
import { Modal } from 'react-native';
import AssistantFab from '../components/AssistantFab';

type NavProp = StackNavigationProp<RootStackParamList, 'ReportAccident'>;

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function ReportAccidentScreen() {
  const navigation = useNavigation<NavProp>();
  const addClaim = useClaimsStore((state) => state.addClaim);
  const updateClaim = useClaimsStore((state) => state.updateClaim);
  const vehicles = useClaimsStore((state) => state.profile.vehicles);
  const addVehicle = useClaimsStore((state) => state.addVehicle);

  const [step, setStep] = useState<Step>(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    vehicles[0]?.id ?? null,
  );
  const [date, setDate] = useState('2026-03-16');
  const [time, setTime] = useState('14:30');
  const [accidentType, setAccidentType] = useState('Car Accident');
  const [description, setDescription] = useState('');
  const [damageDescription, setDamageDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [locationLabel, setLocationLabel] = useState('Tap to confirm accident spot on map');
  const [newVehicleMake, setNewVehicleMake] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [hasPoliceReport, setHasPoliceReport] = useState(false);
  const [acceptedDeclaration, setAcceptedDeclaration] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedClaimId, setSubmittedClaimId] = useState<string | null>(null);

  const goNext = () => {
    if (step < 6) {
      setStep((s) => (s + 1) as Step);
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    if (step === 1) {
      navigation.goBack();
    } else {
      setStep((s) => (s - 1) as Step);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleSubmit = () => {
    if (!acceptedDeclaration) {
      return;
    }
    const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
    const created = addClaim({
      description,
      status: 'Submitted',
      date_created: date,
      fraud_risk_score: hasPoliceReport && images.length ? 8 : 22,
      vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown vehicle',
      submissionDate: date,
      images,
    });
    setSubmittedClaimId(created.claimId);
    setShowSubmitModal(true);

    // Simulated backend progression
    setTimeout(() => {
      updateClaim(created.id, {
        status: 'Under Review',
        timeline: created.timeline.map((s, idx) =>
          idx <= 1 ? { ...s, completed: true } : s,
        ),
      });
    }, 1400);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepHeader}>
      <Text style={styles.stepTitle}>Filling Incident</Text>
      <Text style={styles.stepSubtitle}>Step {step} of 6</Text>
    </View>
  );

  const renderPrimaryButtonLabel = () => {
    if (step === 6) return 'Submit Claim';
    return 'Next';
  };

  const renderContent = () => {
    if (step === 1) {
      return (
        <View>
          <Text style={styles.sectionTitle}>What happened?</Text>
          <Text style={styles.sectionSubtitle}>
            Select the category that best describes your situation.
          </Text>
          {['Car Accident', 'Vehicle Damage', 'Theft', 'Other'].map((type) => {
            const isActive = accidentType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.optionCard, isActive && styles.optionCardActive]}
                onPress={() => setAccidentType(type)}
              >
                <Text
                  style={[
                    styles.optionTitle,
                    isActive && styles.optionTitleActive,
                  ]}
                >
                  {type}
                </Text>
                <Text style={styles.optionSubtitle}>
                  {type === 'Car Accident'
                    ? 'Collision with another vehicle or object.'
                    : type === 'Vehicle Damage'
                    ? 'Damage caused by weather or other events.'
                    : type === 'Theft'
                    ? 'Stolen vehicle or parts.'
                    : 'Something else happened.'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    if (step === 2) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Accident details</Text>
          <Text style={styles.inputLabel}>Vehicle</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            {vehicles.map((vehicle) => {
              const isActive = vehicle.id === selectedVehicleId;
              return (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleCard,
                    isActive && styles.vehicleCardActive,
                  ]}
                  onPress={() => setSelectedVehicleId(vehicle.id)}
                >
                  <Text
                    style={[
                      styles.vehicleTitle,
                      isActive && styles.vehicleTitleActive,
                    ]}
                  >
                    {vehicle.make} {vehicle.model}
                  </Text>
                  <Text style={styles.vehicleSubtitle}>{vehicle.license_plate}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.vehicleCard, styles.addVehicleCard]}
              onPress={() => {
                setIsAddingVehicle(true);
                setShowVehicleModal(true);
              }}
            >
              <Text style={styles.addVehiclePlus}>+</Text>
              <Text style={styles.addVehicleText}>Add new vehicle</Text>
            </TouchableOpacity>
          </ScrollView>
          <Text style={styles.inputLabel}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
          />
          <Text style={styles.inputLabel}>Time</Text>
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
          />
          <Text style={styles.inputLabel}>Short description</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="E.g. Another vehicle backed into the front bumper while exiting the parking spot."
          />
        </View>
      );
    }

    if (step === 3) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Photo capture</Text>
          <Text style={styles.sectionSubtitle}>
            Take a clear photo of the damaged area. Photos stay on this device in this
            simulation and are not uploaded.
          </Text>
          <TouchableOpacity
            style={styles.uploadCard}
            onPress={pickImage}
            activeOpacity={0.9}
          >
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadTitle}>Take photo</Text>
            <Text style={styles.uploadSubtitle}>Open camera to capture damage</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri) => (
              <Image
                key={uri}
                source={{ uri }}
                style={styles.previewImage}
              />
            ))}
          </ScrollView>
          <Text style={styles.inputLabel}>Damage description</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={damageDescription}
            onChangeText={setDamageDescription}
            multiline
          />
        </View>
      );
    }

    if (step === 4) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Confirm accident location</Text>
          <Text style={styles.sectionSubtitle}>
            Use the map placeholder below to confirm where the accident occurred.
          </Text>
          <TouchableOpacity
            style={styles.mapPlaceholder}
            onPress={() =>
              setLocationLabel('Accident location verified • 21 Ndabaningi Sithole Rd, Accra')
            }
          >
            <Text style={styles.mapLabel}>MAP PLACEHOLDER</Text>
          </TouchableOpacity>
          <View style={styles.locationBadgeRow}>
            <View style={styles.locationBadge}>
              <Text style={styles.locationBadgeText}>ACCIDENT LOCATION VERIFIED</Text>
            </View>
          </View>
          <Text style={styles.locationText}>{locationLabel}</Text>
        </View>
      );
    }

    if (step === 5) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Tell us what happened</Text>
          <Text style={styles.sectionSubtitle}>
            Please provide as much detail as possible about the incident. Use voice input to
            record your description instead of typing.
          </Text>
          <View style={styles.voiceBox}>
            <Text style={styles.voiceHint}>
              {isRecording
                ? 'Recording… speak clearly about what happened.'
                : hasVoiceNote
                ? 'Voice note recorded for this incident.'
                : 'Tap the button below to start recording a short description.'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isRecording && styles.voiceButtonActive,
            ]}
            onPress={() => {
              if (isRecording) {
                setIsRecording(false);
                setHasVoiceNote(true);
                if (!description) {
                  setDescription('Voice note recorded about the incident.');
                }
              } else {
                setIsRecording(true);
                setHasVoiceNote(false);
              }
            }}
          >
            <Text style={styles.voiceButtonText}>
              {isRecording ? 'Stop recording' : 'Voice input'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Final review</Text>
        <Text style={styles.sectionSubtitle}>
          Review the information below before submitting your claim.
        </Text>

        <View style={styles.reviewCard}>
          <View style={styles.reviewHeaderRow}>
            <Text style={styles.reviewTitle}>Damage photos</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8, marginBottom: 12 }}
          >
            {images.map((uri) => (
              <Image
                key={uri}
                source={{ uri }}
                style={styles.previewImage}
              />
            ))}
          </ScrollView>

          <View style={styles.divider} />

          <View style={styles.reviewHeaderRow}>
            <Text style={styles.reviewTitle}>Police report</Text>
          </View>
          <TouchableOpacity
            style={styles.policeCard}
            activeOpacity={0.9}
            onPress={() => setHasPoliceReport(true)}
          >
            <Text style={styles.policeTitle}>
              {hasPoliceReport ? 'Police report added' : 'Tap to upload or scan report'}
            </Text>
            <Text style={styles.policeSubtitle}>
              PDF / JPG / PNG (simulated)
            </Text>
          </TouchableOpacity>

          <View style={styles.reviewHeaderRow}>
            <Text style={styles.reviewTitle}>Incident details</Text>
          </View>
          <View style={styles.incidentCard}>
            <View style={styles.mapMini}>
              <Text style={styles.mapMiniLabel}>MAP PLACEHOLDER</Text>
            </View>
            <Text style={styles.reviewLabel}>Description</Text>
            <Text style={styles.reviewValue}>
              {description || 'Voice note recorded about the incident.'}
            </Text>
            <View style={styles.dateTimeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewLabel}>Date</Text>
                <Text style={styles.reviewValue}>{date}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewLabel}>Time</Text>
                <Text style={styles.reviewValue}>{time}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.declarationRow}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              acceptedDeclaration && styles.checkboxChecked,
            ]}
            onPress={() => setAcceptedDeclaration((v) => !v)}
          >
            {acceptedDeclaration && <Text style={styles.checkboxTick}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.declarationText}>
            I certify that the information provided is true and accurate to the best of my
            knowledge. I understand that fraudulent claims may lead to policy cancellation or
            legal action.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MotorIQ</Text>
        <View style={{ width: 40 }} />
      </View>
      {renderStepIndicator()}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 24 }}>
        {renderContent()}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={goBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={goNext}>
          <Text style={styles.primaryButtonText}>{renderPrimaryButtonLabel()}</Text>
        </TouchableOpacity>
      </View>

      <AssistantFab context={`report-step-${step}`} label="Assistant" />

      <Modal visible={showVehicleModal} transparent animationType="fade" onRequestClose={() => setShowVehicleModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add new vehicle</Text>
              <TouchableOpacity onPress={() => setShowVehicleModal(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Make</Text>
            <TextInput style={styles.input} value={newVehicleMake} onChangeText={setNewVehicleMake} />
            <Text style={styles.inputLabel}>Model</Text>
            <TextInput style={styles.input} value={newVehicleModel} onChangeText={setNewVehicleModel} />
            <Text style={styles.inputLabel}>License plate</Text>
            <TextInput style={styles.input} value={newVehiclePlate} onChangeText={setNewVehiclePlate} />

            <View style={styles.modalFooterRow}>
              <TouchableOpacity
                style={styles.modalSecondary}
                onPress={() => {
                  setShowVehicleModal(false);
                  setIsAddingVehicle(false);
                }}
              >
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalPrimary}
                onPress={() => {
                  if (!newVehicleMake || !newVehicleModel || !newVehiclePlate) return;
                  const created = addVehicle({
                    make: newVehicleMake,
                    model: newVehicleModel,
                    year: new Date().getFullYear(),
                    license_plate: newVehiclePlate,
                  });
                  setSelectedVehicleId(created.id);
                  setNewVehicleMake('');
                  setNewVehicleModel('');
                  setNewVehiclePlate('');
                  setIsAddingVehicle(false);
                  setShowVehicleModal(false);
                }}
              >
                <Text style={styles.modalPrimaryText}>Save vehicle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSubmitModal} transparent animationType="fade" onRequestClose={() => setShowSubmitModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>Claim recorded & submitted</Text>
            <Text style={styles.successText}>
              Your claim {submittedClaimId ? `(${submittedClaimId}) ` : ''}has been sent successfully.
              Your insurance will contact you shortly with the next steps.
            </Text>
            <TouchableOpacity
              style={styles.modalPrimary}
              onPress={() => {
                setShowSubmitModal(false);
                navigation.navigate('ClaimsTracking');
              }}
            >
              <Text style={styles.modalPrimaryText}>Go to claims</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  backText: {
    color: '#2563EB',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  stepHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  stepSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionCardActive: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionTitleActive: {
    color: '#FFFFFF',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 160,
  },
  vehicleCardActive: {
    borderColor: '#111827',
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  vehicleTitleActive: {
    color: '#111827',
  },
  vehicleSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  addVehicleCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addVehiclePlus: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  addVehicleText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  newVehicleForm: {
    marginBottom: 12,
  },
  saveVehicleButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  saveVehicleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  policeCard: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 14,
  },
  policeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  policeSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  modalClose: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  modalFooterRow: {
    flexDirection: 'row',
    marginTop: 10,
    columnGap: 10,
  },
  modalSecondary: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSecondaryText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  modalPrimary: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#111827',
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  successText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 14,
  },
  uploadCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadIcon: {
    fontSize: 22,
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 12,
  },
  mapPlaceholder: {
    height: 180,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  locationBadgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  locationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#10B981',
  },
  locationBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  locationText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  reviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  reviewValue: {
    fontSize: 13,
    color: '#111827',
    marginTop: 2,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  incidentCard: {
    marginTop: 4,
  },
  mapMini: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapMiniLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  dateTimeRow: {
    flexDirection: 'row',
    marginTop: 8,
    columnGap: 16,
  },
  voiceBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  voiceHint: {
    fontSize: 13,
    color: '#4B5563',
  },
  voiceButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  voiceButtonActive: {
    backgroundColor: '#DC2626',
  },
  voiceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  uploadStatusText: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 12,
  },
  declarationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  checkboxTick: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  declarationText: {
    flex: 1,
    fontSize: 11,
    color: '#4B5563',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#111827',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginLeft: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
