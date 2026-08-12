import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHospital, type ScanRequest } from '../../context/HospitalContext';
import {
  ArrowLeft, Upload, CheckCircle, User,
  Search, ShieldCheck, Activity, Printer, Image, Trash2, X, FileText, Download
} from 'lucide-react';
import './UploadScanReportPage.css';

const SCAN_TYPES = [
  'NT SCAN',
  'ANOMALY SCAN',
  'ABDOMEN KUB PELVIS',
  'EARLY-VIABILTY',
  'PELVIC SCAN',
  'GROWTH'
];

const UploadScanReportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, doctors, scanRequests, addScanRequest, updateScanReport } = useHospital();

  const doctorListOptions = React.useMemo(() => {
    const defaultDocs = [
      'DR. G. SRI JANANI, MD (OG)',
      'Dr.Sri Janani, MD',
      'DR. G. PRASANNA BALAJI, MD',
      'DR. PRIYA DHARSHINI, MBBS',
      'DR. SARANYA, MBBS, DCH',
      'DR. R. RANJITH, MS'
    ];
    const contextDocs = doctors ? doctors.map(d => d.dname).filter(Boolean) : [];
    const combined = [...contextDocs, ...defaultDocs];
    return Array.from(new Set(combined));
  }, [doctors]);

  // Location state passed when navigating from pending scan row
  const locationState = location.state as { scanId?: string } | null;
  const targetScanId = locationState?.scanId;

  // Form states
  const [existingScan, setExistingScan] = useState<ScanRequest | null>(null);
  const [scanId, setScanId] = useState('');
  const [uhid, setUhid] = useState('');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [scanType, setScanType] = useState('NT SCAN');
  const [radiologist, setRadiologist] = useState('DR. G. SRI JANANI, MD (OG)');
  const [amount, setAmount] = useState('2000');
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // --- IMAGE UPLOAD STATES ---
  const [scanImageFile, setScanImageFile] = useState<File | null>(null);
  const [scanImagePreview, setScanImagePreview] = useState<string>('');
  const [fileName, setFileName] = useState('');

  // --- PRINT MODAL STATES ---
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [savedScanForPrint, setSavedScanForPrint] = useState<ScanRequest | null>(null);

  // --- NT SCAN SPECIFIC FORM STATES ---
  const [ntLmpDate, setNtLmpDate] = useState('');
  const [ntEddLmp, setNtEddLmp] = useState('');
  const [ntGestationalAgeLmp, setNtGestationalAgeLmp] = useState('');
  const [ntPlacenta, setNtPlacenta] = useState('Anterior');

  // Biometry
  const [crlCm, setCrlCm] = useState('');
  const [crlWeeks, setCrlWeeks] = useState('');
  const [crlDays, setCrlDays] = useState('');

  const [bpdCm, setBpdCm] = useState('');
  const [bpdWeeks, setBpdWeeks] = useState('');
  const [bpdDays, setBpdDays] = useState('');

  const [hcCm, setHcCm] = useState('');
  const [hcWeeks, setHcWeeks] = useState('');
  const [hcDays, setHcDays] = useState('');

  const [flCm, setFlCm] = useState('');
  const [flWeeks, setFlWeeks] = useState('');
  const [flDays, setFlDays] = useState('');

  // NT & Nasal Markers
  const [ntValueMm, setNtValueMm] = useState('');
  const [nasalBoneMm, setNasalBoneMm] = useState('');

  // Fetal Cardiac & Doppler
  const [fhrBpm, setFhrBpm] = useState('156');
  const [tricuspidRegurgitation, setTricuspidRegurgitation] = useState('No tricuspid regurgitation');
  const [ductusVenosusFlow, setDuctusVenosusFlow] = useState('Appears Normal');
  const [fetalSkullSpine, setFetalSkullSpine] = useState('Appear Normal Grossly');

  // Maternal Doppler
  const [rightUterinePi, setRightUterinePi] = useState('');
  const [leftUterinePi, setLeftUterinePi] = useState('');

  // Impression & EDD
  const [usgWeeks, setUsgWeeks] = useState('');
  const [usgDays, setUsgDays] = useState('');
  const [ntEddUsg, setNtEddUsg] = useState('');
  const [suggestedAnomalyWeeks, setSuggestedAnomalyWeeks] = useState('18 - 22');

  // Initialize form if targetScanId is passed
  useEffect(() => {
    if (targetScanId) {
      const found = scanRequests.find(s => s.id === targetScanId);
      if (found) {
        setExistingScan(found);
        setScanId(found.id);
        setUhid(found.uhid);
        setPatientName(found.patientName);
        setScanType(found.scanType);
        setRadiologist(found.radiologist || 'Dr.Sri Janani');
        setAmount((found.amount || 2000).toString());
      }
    } else {
      setScanId(`SCN-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [targetScanId, scanRequests]);

  const handleSelectPatient = (p: any) => {
    setUhid(p.uhid);
    setPatientName(p.name);
    setPhone(p.phone || '');
    setShowPatientDropdown(false);
    setPatientSearch('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setScanImageFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScanImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setScanImageFile(null);
    setScanImagePreview('');
    setFileName('');
  };

  // --- EARLY VIABILITY SCAN SPECIFIC FORM STATES ---
  const [evRoutineScan, setEvRoutineScan] = useState('');
  const [evRoute, setEvRoute] = useState('');
  const [evIndications, setEvIndications] = useState('');
  const [evGestationalSac, setEvGestationalSac] = useState('');
  const [evYolkSac, setEvYolkSac] = useState('');
  const [evFhrBpm, setEvFhrBpm] = useState('');
  const [evFetalMovement, setEvFetalMovement] = useState('');
  const [evCrownRumpLengthCm, setEvCrownRumpLengthCm] = useState('');
  const [evImpression, setEvImpression] = useState('');
  const [evDoctorSignature, setEvDoctorSignature] = useState('');

  // --- GROWTH SCAN SPECIFIC FORM STATES ---
  const [growthPatientHistory, setGrowthPatientHistory] = useState('');
  const [growthPresentation, setGrowthPresentation] = useState('');
  const [growthPlacenta, setGrowthPlacenta] = useState('');
  const [growthLiquor, setGrowthLiquor] = useState('');
  const [growthFetalMovements, setGrowthFetalMovements] = useState('');
  const [growthCardiacActivity, setGrowthCardiacActivity] = useState('');
  const [growthFhrBpm, setGrowthFhrBpm] = useState('');

  // Growth Biometry
  const [growthBpdCm, setGrowthBpdCm] = useState('');
  const [growthHcCm, setGrowthHcCm] = useState('');
  const [growthOfdCm, setGrowthOfdCm] = useState('');
  const [growthAcCm, setGrowthAcCm] = useState('');
  const [growthFlCm, setGrowthFlCm] = useState('');
  const [growthEfwGrams, setGrowthEfwGrams] = useState('');

  // Growth Impression & Summary
  const [growthImpression, setGrowthImpression] = useState('');
  const [growthImpressionLiquor, setGrowthImpressionLiquor] = useState('');
  const [growthImpressionPresentation, setGrowthImpressionPresentation] = useState('');
  const [growthImpressionPlacenta, setGrowthImpressionPlacenta] = useState('');
  const [growthDoctorSignature, setGrowthDoctorSignature] = useState('');

  // --- ABDOMEN KUB PELVIS SCAN SPECIFIC FORM STATES ---
  const [kubLiver, setKubLiver] = useState('Liver filled with homogeneous parenchymal echoes. No abscess of mass lesion in the liver.');
  const [kubGallBladder, setKubGallBladder] = useState('Gall bladder appeared normal. No calculi seen in the gall bladder.');
  const [kubCommonDuct, setKubCommonDuct] = useState('Common duct appeared normal. No calculi seen in the common duct.');
  const [kubPancreas, setKubPancreas] = useState('Pancreas appeared normal.');
  const [kubPancreasHead, setKubPancreasHead] = useState('2.0');
  const [kubPancreasNeck, setKubPancreasNeck] = useState('2.2');
  const [kubPancreasBody, setKubPancreasBody] = useState('2.0');
  const [kubPancreasTail, setKubPancreasTail] = useState('2.0');
  const [kubSpleen, setKubSpleen] = useState('Spleen appeared normal.');
  const [kubAorta, setKubAorta] = useState('Aorta appeared normal. No Para aortic nodes seen.');
  const [kubFreeFluid, setKubFreeFluid] = useState('No free fluid in the peritoneal cavity');
  const [kubParaAorticNodes, setKubParaAorticNodes] = useState('No para aortic lymphadenopathy');
  const [kubAdrenalGlands, setKubAdrenalGlands] = useState('Adrenal glands appeared normal.');

  // KUB States
  const [kubKidneysGeneral, setKubKidneysGeneral] = useState('Cortex and collecting system of both kidneys appeared normal.');
  const [kubRightKidneySize, setKubRightKidneySize] = useState('9.5 x 3.4');
  const [kubLeftKidneySize, setKubLeftKidneySize] = useState('10.4 x 4.4');
  const [kubUreters, setKubUreters] = useState('No dilatation of both ureters seen.');
  const [kubBladder, setKubBladder] = useState('Bladder appeared normal.');
  const [kubPrevoidSize, setKubPrevoidSize] = useState('2.0 x 2.0 x 2.0');
  const [kubPrevoidVolume, setKubPrevoidVolume] = useState('4.0');
  const [kubPostvoidStatus, setKubPostvoidStatus] = useState('Postvoid showed satisfactory emptying of bladder (Volume = 0.5ml)');
  const [kubIliacFossae, setKubIliacFossae] = useState('No mass lesion seen in both iliac fossae.');

  // Pelvis States
  const [kubUterus, setKubUterus] = useState('Normal appearing uterus with homogeneous myometrial echoes.');
  const [kubUterusSize, setKubUterusSize] = useState('7.0 x 3.3 x 3.6');
  const [kubCavityEcho, setKubCavityEcho] = useState('Cavity echo appeared normal.');
  const [kubCavityThickness, setKubCavityThickness] = useState('6.0');
  const [kubRightOvary, setKubRightOvary] = useState('Right ovary appeared normal.');
  const [kubRightOvarySize, setKubRightOvarySize] = useState('3.5 x 2.2');
  const [kubLeftOvary, setKubLeftOvary] = useState('Left ovary appeared normal.');
  const [kubLeftOvarySize, setKubLeftOvarySize] = useState('2.9 x 1.9');
  const [kubAdnexa, setKubAdnexa] = useState('Both adnexa appeared normal.');

  // Impression & Doctor
  const [kubImpression, setKubImpression] = useState('NORMAL APPEARING LIVER, GALL BLADDER, COMMONDUCT, PANCREAS, SPLEEN, AORTA, ADRENAL GLANDS, BOTH KIDNEYS, BOTH URETERS, BLADDER, PROSTATE.');
  const [kubDoctorSignature, setKubDoctorSignature] = useState('DR. G. SRI JANANI');

  // --- PELVIC SCAN SPECIFIC FORM STATES ---
  const [pelvicPatientHistory, setPelvicPatientHistory] = useState('AMENORRHEA');
  const [pelvicUterusDesc, setPelvicUterusDesc] = useState('The Uterus is Anteverted in position and appears normal in shape in outline. The Myometrium Shows Uniform Echotexture With No Evidence Of Focal Lesions.');
  const [pelvicUterusSize, setPelvicUterusSize] = useState('4.9 x 3.48 x 3.44');
  const [pelvicUterusVolume, setPelvicUterusVolume] = useState('31.278');
  const [pelvicEtDesc, setPelvicEtDesc] = useState('Endometrial cavity appeared normal');
  const [pelvicEtThickness, setPelvicEtThickness] = useState('6.08');
  const [pelvicCervix, setPelvicCervix] = useState('The Cervix Appears Normal In Size & Echotexture. The Cervical Canal Is Unremarkable.');
  const [pelvicRightOvaryDesc, setPelvicRightOvaryDesc] = useState('The Right Ovary Is Visualized In The Right Adnexal Region. It Shows Normal Echotexture With Multiple Follicles Arranged Peripherally (PCOS).');
  const [pelvicRightOvarySize, setPelvicRightOvarySize] = useState('2.77 x 1.85 x 2.38');
  const [pelvicRightOvaryVolume, setPelvicRightOvaryVolume] = useState('6.386');
  const [pelvicLeftOvaryDesc, setPelvicLeftOvaryDesc] = useState('The Left Ovary Is Visualized In The Left Adnexal Region. It shows normal echotexture with multiple follicles arranged peripherally (PCOS).');
  const [pelvicLeftOvarySize, setPelvicLeftOvarySize] = useState('2.33 x 1.43 x 1.80');
  const [pelvicLeftOvaryVolume, setPelvicLeftOvaryVolume] = useState('3.140');
  const [pelvicPod, setPelvicPod] = useState('No free fluid is seen in the pouch of douglas.');
  const [pelvicImpression, setPelvicImpression] = useState('BILATERAL PCOS');
  const [pelvicDoctorSignature, setPelvicDoctorSignature] = useState('DR. G. SRI JANANI');

  // --- ANOMALY SCAN SPECIFIC FORM STATES ---
  const [anomalyLmpDate, setAnomalyLmpDate] = useState('25.03.2024');
  const [anomalyEddLmp, setAnomalyEddLmp] = useState('30.12.2024');
  const [anomalyGestationalAgeLmp, setAnomalyGestationalAgeLmp] = useState('21 WEEKS 3 DAYS');
  const [anomalyGestation, setAnomalyGestation] = useState('Single fetus.');
  const [anomalyPresentation, setAnomalyPresentation] = useState('Cephalic');
  const [anomalyPlacenta, setAnomalyPlacenta] = useState('Anterior ( Grade – I )');
  const [anomalyLiquor, setAnomalyLiquor] = useState('Adequate');
  const [anomalyCervicalLength, setAnomalyCervicalLength] = useState('3.3');

  const [anomalyActivity, setAnomalyActivity] = useState('Fetal cardiac activity & movements are good and is regular.');
  const [anomalyFhrBpm, setAnomalyFhrBpm] = useState('141');

  // Anomaly Biometry (mms, WEEKS, DAYS)
  const [anomalyBpdMm, setAnomalyBpdMm] = useState('49.8');
  const [anomalyBpdWeeks, setAnomalyBpdWeeks] = useState('21');
  const [anomalyBpdDays, setAnomalyBpdDays] = useState('1');

  const [anomalyHcMm, setAnomalyHcMm] = useState('186.1');
  const [anomalyHcWeeks, setAnomalyHcWeeks] = useState('20');
  const [anomalyHcDays, setAnomalyHcDays] = useState('4');

  const [anomalyAcMm, setAnomalyAcMm] = useState('147.9');
  const [anomalyAcWeeks, setAnomalyAcWeeks] = useState('20');
  const [anomalyAcDays, setAnomalyAcDays] = useState('0');

  const [anomalyFlMm, setAnomalyFlMm] = useState('33.2');
  const [anomalyFlWeeks, setAnomalyFlWeeks] = useState('20');
  const [anomalyFlDays, setAnomalyFlDays] = useState('3');

  const [anomalyEfwGrams, setAnomalyEfwGrams] = useState('346 +/- 51 GRAMS');

  // System-by-System Check
  const [anomalyBrain, setAnomalyBrain] = useState('Cavum septum pellucidum visualized.\nBoth ventricles not dilated.\nCisterna magna not prominent.\nCerebellum visualized appear normal.');
  const [anomalyChest, setAnomalyChest] = useState('No obvious cystic lesion noted in the chest.');
  const [anomalyAbdomen, setAnomalyAbdomen] = useState('Stomach bubble visualized.\nSitus solitus\nBoth kidneys visualized appears normal.\nUrinary bladder visualized.');
  const [anomalyFace, setAnomalyFace] = useState('Nose and lips appear normal.');
  const [anomalyHeart, setAnomalyHeart] = useState('Four chamber view, left and right outflow tract appears normal.');
  const [anomalySpine, setAnomalySpine] = useState('Appears normal.');
  const [anomalyOrbits, setAnomalyOrbits] = useState('No obvious abnormality noted.');
  const [anomalySkeleton, setAnomalySkeleton] = useState('Visualized long bones-- appropriate for the gestational age.\nBoth feet & hands appear normal.');
  const [anomalyUmbilicalCord, setAnomalyUmbilicalCord] = useState('Umbilical cord shows two arteries and one vein.\nMean uterine artery PI 1.0');

  // Impression & Summary
  const [anomalyImpression, setAnomalyImpression] = useState('Single live intrauterine fetus with gestational age corresponding to about 20 weeks 4 days as per USG.\nAdequate amniotic fluid.\nVariable presentation at time of scan.\nSuggested review scan after 1week for fetal spine.');
  const [anomalyEddUsg, setAnomalyEddUsg] = useState('05.01.2025');
  const [anomalyDoctorSignature, setAnomalyDoctorSignature] = useState('DR.M.MURALI GANESH, M.B.B.S DNB (RD)');
  const [anomalyFmfId, setAnomalyFmfId] = useState('FMF ID:214059');

  // Generic scan findings
  const [genericFindings, setGenericFindings] = useState('');

  const handlePrintReportOnly = (e: React.MouseEvent) => {
    e.preventDefault();
    const record: ScanRequest = {
      id: existingScan ? existingScan.id : (scanId || `SCN-${Date.now().toString().slice(-4)}`),
      patientName: patientName.trim() || 'Patient Name',
      uhid: uhid.trim() || 'UHID-NEW',
      scanType: scanType,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      reportFile: fileName.trim() || `${scanType.replace(/\s+/g, '_')}_Report.pdf`,
      findings: generateFindingsText(),
      radiologist: radiologist,
      amount: parseFloat(amount) || 2000
    };
    setSavedScanForPrint(record);
    setShowPrintModal(true);
  };

  const generateFindingsText = () => {
    if (scanType === 'NT SCAN') {
      return `NT SCAN RADIOLOGICAL REPORT:
--------------------------------------------------
L.M.P Date: ${ntLmpDate || 'N/A'}
E.D.D as per L.M.P: ${ntEddLmp || 'N/A'}
Gestational Age (as per LMP): ${ntGestationalAgeLmp || 'N/A'}

Placenta: ${ntPlacenta || 'Anterior'}

FETAL BIOMETRY:
• CRL: ${crlCm || '--'} cm (corresponding to ${crlWeeks || '--'} weeks ${crlDays || '--'} days)
• BPD: ${bpdCm || '--'} cm (corresponding to ${bpdWeeks || '--'} weeks ${bpdDays || '--'} days)
• HC: ${hcCm || '--'} cm (corresponding to ${hcWeeks || '--'} weeks ${hcDays || '--'} days)
• FL: ${flCm || '--'} cm (corresponding to ${flWeeks || '--'} weeks ${flDays || '--'} days)

NT & NASAL BONE MARKERS:
• Nuchal Translucency (NT): ${ntValueMm || '--'} mm
• Nasal Bone: Visualized ${nasalBoneMm ? nasalBoneMm + ' mm' : 'Yes'}

FETAL ANATOMY & CARDIAC DOPPLER:
• Fetal Heart Rate: ${fhrBpm || '--'} bpm regular rhythm
• Tricuspid Regurgitation: ${tricuspidRegurgitation}
• Ductus Venosus Flow: ${ductusVenosusFlow}
• Fetal Skull & Spine: ${fetalSkullSpine}

MATERNAL UTERINE DOPPLER:
• Right Uterine Artery PI: ${rightUterinePi || '--'} | Left Uterine Artery PI: ${leftUterinePi || '--'}

IMPRESSION:
Single live intra uterine gestational age corresponding to about ${usgWeeks || '--'} weeks ${usgDays || '--'} days as per USG.
E.D.D as per USG: ${ntEddUsg || 'N/A'}
Suggested ANOMALY Scan between: ${suggestedAnomalyWeeks || '18 - 22'} weeks.`;
    } else if (scanType === 'EARLY-VIABILTY' || scanType === 'EARLY VIABILITY' || scanType.includes('EARLY')) {
      return `EARLY VIABILITY ULTRASOUND REPORT
--------------------------------------------------
ROUTINE SCAN: ${evRoutineScan || '________'}
ROUTE: ${evRoute || '________'}
INDICATION(S): ${evIndications || '________'}

REAL TIME B-MODE ULTRASONOGRAPHY OF GRAVID UTERUS DONE

FETAL SURVEY:
• Gestational SAC: ${evGestationalSac || '________'}
• Yolk SAC: ${evYolkSac || '________'}
• FHR: ${evFhrBpm ? evFhrBpm + ' bpm' : '_____ bpm'}
• Fetal Movement: ${evFetalMovement || '________'}

FETAL BIOMETRY:
• Groun Lump Length (Crown Rump Length): ${evCrownRumpLengthCm || '______'} cm

IMPRESSION:
${evImpression || '___________________'}

Signature of the Doctor: ${evDoctorSignature || radiologist || '___________________'}`;
    } else if (scanType === 'GROWTH' || scanType.includes('GROWTH')) {
      return `GROWTH ULTRASOUND SCAN REPORT
--------------------------------------------------
PATIENT HISTORY: ${growthPatientHistory || '________'}

FETAL SURVEY (SINGLETON FETUS):
• Presentation: ${growthPresentation || '_______'}
• Placenta: ${growthPlacenta || '_______'}
• Liquor: ${growthLiquor ? growthLiquor + ' cm' : '_________cm'}
• Fetal Movements: ${growthFetalMovements || '______'}
• Cardiac Activity: ${growthCardiacActivity || '_________'}
• FHR: ${growthFhrBpm ? growthFhrBpm + ' BPM' : '_______BPM'}

FETAL BIOMETRY (TABLE TYPE):
------------------------------------------------------------
Biometry                          | Measurement (in cms)
------------------------------------------------------------
Biparietal Diameter               | ${growthBpdCm ? growthBpdCm + ' cms' : '____ cms'}
Head Circumference                | ${growthHcCm ? growthHcCm + ' cms' : '_______cms'}
OFD                               | ${growthOfdCm ? growthOfdCm + ' cms' : '________cms'}
Abdominal Circumference           | ${growthAcCm ? growthAcCm + ' cms' : '_______cms'}
Femur Length                      | ${growthFlCm ? growthFlCm + ' cms' : '_______cms'}
Estimated Fetal Weight            | ${growthEfwGrams || '_________'}
------------------------------------------------------------

IMPRESSION: ${growthImpression || '__________'}

Liquor: ${growthImpressionLiquor || '___________'}
Presentation: ${growthImpressionPresentation || '____________'}
Placenta: ${growthImpressionPlacenta || '_____________'}

DECLARATION UNDER PC-PNDT ACT:
I (${growthDoctorSignature || radiologist || 'DR. G. SRI JANANI'}) declare that while conducting ultrasonography of ${patientName || '__________________________'}, I have neither detected nor disclosed the sex of the fetus.

Signature of the Doctor: ${growthDoctorSignature || radiologist || '___________________'}`;
    } else if (scanType === 'ABDOMEN KUB PELVIS' || scanType.includes('ABDOMEN') || scanType.includes('KUB')) {
      return `WHOLE ABDOMEN REPORT
--------------------------------------------------
Real time B-mode ultrasonography of Abdomen, KUB, Uterus and Ovaries done

ABDOMEN:
• Liver: ${kubLiver}
• Gall Bladder: ${kubGallBladder}
• Common Duct: ${kubCommonDuct}
• Pancreas: ${kubPancreas}
  - Head: ${kubPancreasHead} cm | Neck: ${kubPancreasNeck} cm | Body: ${kubPancreasBody} cm | Tail: ${kubPancreasTail} cm
• Spleen: ${kubSpleen}
• Aorta: ${kubAorta}
• Peritoneal Cavity: ${kubFreeFluid}
• Lymphadenopathy: ${kubParaAorticNodes}
• Adrenal Glands: ${kubAdrenalGlands}

KUB:
• Kidneys: ${kubKidneysGeneral}
  - Right Kidney: ${kubRightKidneySize} cm
  - Left Kidney: ${kubLeftKidneySize} cm
• Ureters: ${kubUreters}
• Bladder: ${kubBladder}
  - Prevoid Bladder: ${kubPrevoidSize} cm (Volume = ${kubPrevoidVolume}cc)
  - Postvoid: ${kubPostvoidStatus}
• Iliac Fossae: ${kubIliacFossae}

PELVIS:
Transabdominal ultrasonography of the pelvis done.
• Uterus: ${kubUterus} (Measured: ${kubUterusSize} cm)
• Cavity Echo: ${kubCavityEcho} (Thickness = ${kubCavityThickness} mm)
• Right Ovary: ${kubRightOvary} (Measured: ${kubRightOvarySize} cm)
• Left Ovary: ${kubLeftOvary} (Measured: ${kubLeftOvarySize} cm)
• Adnexa: ${kubAdnexa}

IMPRESSION:
${kubImpression}

Signature of the Doctor: ${kubDoctorSignature || radiologist}`;
    } else if (scanType === 'PELVIC SCAN' || scanType.includes('PELVIC')) {
      return `PELVIS SCAN REPORT
--------------------------------------------------
PATIENT HISTORY: ${pelvicPatientHistory || 'AMENORRHEA'}

Transvaginal sonography of the pelvis done

UTERUS: ${pelvicUterusDesc}
  - Measured Approximately: ${pelvicUterusSize} cm (Volume ${pelvicUterusVolume} cc)

ET: ${pelvicEtDesc} measured ${pelvicEtThickness} cm

CERVIX: ${pelvicCervix}

RIGHT OVARY: ${pelvicRightOvaryDesc}
  - Measured Approximately: ${pelvicRightOvarySize} cm (Volume ${pelvicRightOvaryVolume} cc)

LEFT OVARY: ${pelvicLeftOvaryDesc}
  - Measured Approximately: ${pelvicLeftOvarySize} cm (Volume ${pelvicLeftOvaryVolume} cc)

POD: ${pelvicPod}

IMPRESSION: ${pelvicImpression}

Signature of the Doctor: ${pelvicDoctorSignature || radiologist}`;
    } else if (scanType === 'ANOMALY SCAN' || scanType.includes('ANOMALY')) {
      return `ANOMALY SCAN REPORT
--------------------------------------------------
L.M.P Date: ${anomalyLmpDate} | E.D.D as per L.M.P: ${anomalyEddLmp}
Gestational Age (as per LMP): ${anomalyGestationalAgeLmp}

Gestation: ${anomalyGestation} | Presentation: ${anomalyPresentation}
Placenta: ${anomalyPlacenta} | Liquor: ${anomalyLiquor} | Cervical Length: ${anomalyCervicalLength} cms

ACTIVITY: ${anomalyActivity} | HR: ${anomalyFhrBpm} BPM

FETAL BIOMETRY (mms, WEEKS, DAYS):
• BPD: ${anomalyBpdMm} mm (${anomalyBpdWeeks} weeks ${anomalyBpdDays} days)
• HC: ${anomalyHcMm} mm (${anomalyHcWeeks} weeks ${anomalyHcDays} days)
• AC: ${anomalyAcMm} mm (${anomalyAcWeeks} weeks ${anomalyAcDays} days)
• FL: ${anomalyFlMm} mm (${anomalyFlWeeks} weeks ${anomalyFlDays} days)
• E. F WT.: ${anomalyEfwGrams}

FETAL ANOMALY EVALUATION:
• BRAIN: ${anomalyBrain}
• CHEST: ${anomalyChest}
• ABDOMEN: ${anomalyAbdomen}
• FACE: ${anomalyFace}
• HEART: ${anomalyHeart}
• SPINE: ${anomalySpine}
• ORBITS: ${anomalyOrbits}
• SKELETON: ${anomalySkeleton}
• UMBILICAL CORD & DOPPLER: ${anomalyUmbilicalCord}

IMPRESSION:
${anomalyImpression}
E.D.D as per USG: ${anomalyEddUsg}

Note: All fetal anomalies could not be detected as it depends on fetal position and amniotic fluid at the time of scan.

${anomalyDoctorSignature || radiologist}
${anomalyFmfId}`;
    } else {
      return genericFindings || `Single live intrauterine gestation corresponding to gestational age. Fetal cardiac activity and physiological parameters within normal limits for ${scanType}.`;
    }
  };

  const saveScanRecord = (): ScanRequest => {
    const reportFileToSave = fileName.trim() || `${scanType.replace(/\s+/g, '_')}_Report.pdf`;
    const findingsText = generateFindingsText();

    const scanRecord: ScanRequest = {
      id: existingScan ? existingScan.id : (scanId || `SCN-${Date.now().toString().slice(-4)}`),
      patientName: patientName.trim(),
      uhid: uhid.trim() || 'UHID-NEW',
      scanType: scanType,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      reportFile: reportFileToSave,
      findings: findingsText,
      radiologist: radiologist,
      amount: parseFloat(amount) || 2000
    };

    if (existingScan) {
      updateScanReport(existingScan.id, reportFileToSave, findingsText, radiologist);
    } else {
      addScanRequest(scanRecord);
    }

    return scanRecord;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      alert('Please enter or select a Patient Name');
      return;
    }

    saveScanRecord();
    alert(`Scan report saved successfully for ${patientName}!`);
    navigate('/scan');
  };

  const handleSaveAndPrint = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      alert('Please enter or select a Patient Name');
      return;
    }

    const record = saveScanRecord();
    setSavedScanForPrint(record);
    setShowPrintModal(true);
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.uhid.toLowerCase().includes(patientSearch.toLowerCase()) ||
    (p.phone && p.phone.includes(patientSearch))
  );

  return (
    <div className="upload-scan-container page-transition">
      {/* Top Header Navigation */}
      <div className="upload-scan-header">
        <div className="header-title-group">
          <button className="btn-back" onClick={() => navigate('/scan')}>
            <ArrowLeft size={18} /> Back to Scan Center
          </button>
          <div>
            <h2>Upload  Scan Report</h2>
            <p>Enter patient details, select scan type, attach scan images, and print report</p>
          </div>
        </div>

        <div className="header-scan-badge">
          <Upload size={20} />
          <span>Report Upload & Print Mode</span>
        </div>
      </div>

      {/* Main Upload Form Card */}
      <div className="upload-scan-card">
        <form onSubmit={handleSubmit}>

          {/* Section 1: Patient Selection & Details */}
          <div className="form-section">
            <h3 className="section-title">
              <User size={18} className="title-icon" /> Patient Information
            </h3>

            <div className="patient-selector-box">
              <label>Search & Select Registered Patient (Optional)</label>
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Type Patient Name, UHID, or Mobile Number..."
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setShowPatientDropdown(true);
                  }}
                  onFocus={() => setShowPatientDropdown(true)}
                />
              </div>

              {showPatientDropdown && patientSearch.trim() !== '' && (
                <div className="patient-dropdown-menu">
                  {filteredPatients.length === 0 ? (
                    <div className="patient-dropdown-item empty">No matching registered patients found</div>
                  ) : (
                    filteredPatients.map((p, idx) => (
                      <div
                        key={idx}
                        className="patient-dropdown-item"
                        onClick={() => handleSelectPatient(p)}
                      >
                        <div className="p-name">{p.name}</div>
                        <div className="p-details">UHID: {p.uhid} | Phone: {p.phone || 'N/A'}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Patient UHID <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={uhid}
                  onChange={(e) => setUhid(e.target.value)}
                  placeholder="e.g. UHID-3490"
                  required
                />
              </div>

              <div className="form-group">
                <label>Patient Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter full patient name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Scan Modality & Radiologist */}
          <div className="form-section">
            <h3 className="section-title">
              <ShieldCheck size={18} className="title-icon" /> Scan Selection & Radiologist Details
            </h3>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Select Scan <span className="required">*</span></label>
                <select
                  className="form-control select-scan-type"
                  value={scanType}
                  onChange={(e) => setScanType(e.target.value)}
                  required
                >
                  {SCAN_TYPES.map((st, idx) => (
                    <option key={idx} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Consulting Radiologist / Doctor Signature</label>
                <select
                  className="form-control"
                  value={radiologist}
                  onChange={(e) => {
                    const selectedDoc = e.target.value;
                    setRadiologist(selectedDoc);
                    if (!evDoctorSignature) setEvDoctorSignature(selectedDoc);
                    if (!growthDoctorSignature) setGrowthDoctorSignature(selectedDoc);
                    if (!kubDoctorSignature) setKubDoctorSignature(selectedDoc);
                    if (!pelvicDoctorSignature) setPelvicDoctorSignature(selectedDoc);
                  }}
                >
                  {doctorListOptions.map((doc, idx) => (
                    <option key={idx} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Scan Charges (₹)</label>
                <div className="amount-input-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="2000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: NT SCAN Detailed Inputs (Rendered only when scanType === 'NT SCAN') */}
          {scanType === 'NT SCAN' && (
            <div className="form-section nt-scan-section">
              <h3 className="section-title nt-title">
                <Activity size={18} className="title-icon" /> NT SCAN Detailed Clinical Findings & Biometry
              </h3>

              {/* LMP & Gestational Age Sub-block */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">LMP & Clinical Gestational Age</h4>
                <div className="form-grid-4">
                  <div className="form-group">
                    <label>L.M.P Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={ntLmpDate}
                      onChange={(e) => setNtLmpDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>E.D.D as per L.M.P</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 19-02-2027"
                      value={ntEddLmp}
                      onChange={(e) => setNtEddLmp(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Gestational Age (as per LMP)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 12 weeks 3 days"
                      value={ntGestationalAgeLmp}
                      onChange={(e) => setNtGestationalAgeLmp(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Placenta Position</label>
                    <select
                      className="form-control"
                      value={ntPlacenta}
                      onChange={(e) => setNtPlacenta(e.target.value)}
                    >
                      <option value="Anterior">Anterior</option>
                      <option value="Posterior">Posterior</option>
                      <option value="Fundal">Fundal</option>
                      <option value="Low-Lying">Low-Lying</option>
                      <option value="Lateral Right">Lateral Right</option>
                      <option value="Lateral Left">Lateral Left</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fetal Biometry Grid Block */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Biometry Measurements</h4>
                <div className="biometry-table-wrapper">
                  <table className="biometry-input-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Measurement (cm)</th>
                        <th>Corresponding Weeks</th>
                        <th>Corresponding Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>CRL (Crown-Rump Length)</strong></td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="e.g. 5.8"
                            value={crlCm} onChange={(e) => setCrlCm(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="wks"
                            value={crlWeeks} onChange={(e) => setCrlWeeks(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="days"
                            value={crlDays} onChange={(e) => setCrlDays(e.target.value)}
                          />
                        </td>
                      </tr>

                      <tr>
                        <td><strong>BPD (Biparietal Diameter)</strong></td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="e.g. 2.1"
                            value={bpdCm} onChange={(e) => setBpdCm(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="wks"
                            value={bpdWeeks} onChange={(e) => setBpdWeeks(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="days"
                            value={bpdDays} onChange={(e) => setBpdDays(e.target.value)}
                          />
                        </td>
                      </tr>

                      <tr>
                        <td><strong>HC (Head Circumference)</strong></td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="e.g. 7.6"
                            value={hcCm} onChange={(e) => setHcCm(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="wks"
                            value={hcWeeks} onChange={(e) => setHcWeeks(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="days"
                            value={hcDays} onChange={(e) => setHcDays(e.target.value)}
                          />
                        </td>
                      </tr>

                      <tr>
                        <td><strong>FL (Femur Length)</strong></td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="e.g. 0.9"
                            value={flCm} onChange={(e) => setFlCm(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="wks"
                            value={flWeeks} onChange={(e) => setFlWeeks(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="days"
                            value={flDays} onChange={(e) => setFlDays(e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NT & Nasal Bone Markers Card */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Aneuploidy Screening Markers</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Nuchal Translucency (NT) <span className="unit-label">(mm)</span></label>
                    <input
                      type="text"
                      className="form-control nt-highlight-input"
                      placeholder="e.g. 1.2 mm"
                      value={ntValueMm}
                      onChange={(e) => setNtValueMm(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Nasal Bone Visualized <span className="unit-label">(mm)</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 2.1 mm"
                      value={nasalBoneMm}
                      onChange={(e) => setNasalBoneMm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Fetal Cardiac & Doppler Markers */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Cardiac & Anatomical Evaluation</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Fetal Heart Rate (FHR)</label>
                    <div className="input-suffix-wrapper">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 156"
                        value={fhrBpm}
                        onChange={(e) => setFhrBpm(e.target.value)}
                      />
                      <span className="input-suffix">bpm regular rhythm</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Tricuspid Regurgitation</label>
                    <select
                      className="form-control"
                      value={tricuspidRegurgitation}
                      onChange={(e) => setTricuspidRegurgitation(e.target.value)}
                    >
                      <option value="No tricuspid regurgitation">No tricuspid regurgitation</option>
                      <option value="Tricuspid regurgitation present">Tricuspid regurgitation present</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Ductus Venosus Flow</label>
                    <select
                      className="form-control"
                      value={ductusVenosusFlow}
                      onChange={(e) => setDuctusVenosusFlow(e.target.value)}
                    >
                      <option value="Appears Normal">Ductus venosus flow appears normal</option>
                      <option value="Abnormal / Reversed A-Wave">Abnormal / Reversed A-Wave</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Fetal Skull & Spine</label>
                    <select
                      className="form-control"
                      value={fetalSkullSpine}
                      onChange={(e) => setFetalSkullSpine(e.target.value)}
                    >
                      <option value="Appear Normal Grossly">Fetal skull and spine appear normal grossly</option>
                      <option value="Requires Followup">Requires Followup</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Maternal Uterine Doppler */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Maternal Uterine Artery Doppler</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Right Uterine Artery PI</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 1.4"
                      value={rightUterinePi}
                      onChange={(e) => setRightUterinePi(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Left Uterine Artery PI</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 1.5"
                      value={leftUterinePi}
                      onChange={(e) => setLeftUterinePi(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Impression & EDD as per USG */}
              <div className="nt-block-card impression-card">
                <h4 className="nt-block-title">USG Impression & Follow-up Recommendation</h4>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>USG Gestational Age (Weeks)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 12"
                      value={usgWeeks}
                      onChange={(e) => setUsgWeeks(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>USG Gestational Age (Days)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 4"
                      value={usgDays}
                      onChange={(e) => setUsgDays(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>E.D.D as per USG</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 21-02-2027"
                      value={ntEddUsg}
                      onChange={(e) => setNtEddUsg(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Suggested ANOMALY Scan between (Weeks)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 18 - 22"
                      value={suggestedAnomalyWeeks}
                      onChange={(e) => setSuggestedAnomalyWeeks(e.target.value)}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Section 3B: EARLY VIABILITY SCAN Detailed Inputs (Rendered when scanType === 'EARLY-VIABILTY' or 'EARLY VIABILITY') */}
          {(scanType === 'EARLY-VIABILTY' || scanType === 'EARLY VIABILITY' || scanType.includes('EARLY')) && (
            <div className="form-section nt-scan-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="section-title nt-title" style={{ margin: 0 }}>
                  <Activity size={18} className="title-icon" /> Early Viability Ultrasound Detailed Clinical Findings
                </h3>
                <button
                  type="button"
                  className="btn-save-print"
                  style={{ padding: '6px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0284c7' }}
                  onClick={handlePrintReportOnly}
                >
                  <Printer size={16} /> Print Report
                </button>
              </div>

              {/* Scan Nature, Route & Indications */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Scan Nature, Route & Indications</h4>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Routine Scan / Scan Nature</label>
                    <input
                      type="text"
                      className="form-control"
                      value={evRoutineScan}
                      onChange={(e) => setEvRoutineScan(e.target.value)}
                      placeholder="e.g. Routine scan"
                    />
                  </div>

                  <div className="form-group">
                    <label>Route</label>
                    <input
                      type="text"
                      className="form-control"
                      value={evRoute}
                      onChange={(e) => setEvRoute(e.target.value)}
                      placeholder="e.g. TVS / TAS"
                    />
                  </div>

                  <div className="form-group">
                    <label>Indication(s)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={evIndications}
                      onChange={(e) => setEvIndications(e.target.value)}
                      placeholder="e.g. Routine early pregnancy evaluation"
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px', padding: '10px 14px', background: '#e0f2fe', borderRadius: '6px', borderLeft: '4px solid #0284c7', fontSize: '13px', color: '#0369a1', fontWeight: 600 }}>
                  REAL TIME B-MODE ULTRASONOGRAPHY OF GRAVID UTERUS DONE
                </div>
              </div>

              {/* Fetal Survey Block */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Survey</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Gestational SAC</label>
                    <input
                      type="text"
                      className="form-control"
                      value={evGestationalSac}
                      onChange={(e) => setEvGestationalSac(e.target.value)}
                      placeholder="e.g. Single intrauterine sac seen"
                    />
                  </div>

                  <div className="form-group">
                    <label>Yoke SAC (Yolk SAC)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={evYolkSac}
                      onChange={(e) => setEvYolkSac(e.target.value)}
                      placeholder="e.g. Visualized"
                    />
                  </div>

                  <div className="form-group">
                    <label>FHR (Fetal Heart Rate)</label>
                    <div className="input-suffix-wrapper">
                      <input
                        type="text"
                        className="form-control"
                        value={evFhrBpm}
                        onChange={(e) => setEvFhrBpm(e.target.value)}
                        placeholder="e.g. 144"
                      />
                      <span className="input-suffix">bpm</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Fetal Movement</label>
                    <input
                      type="text"
                      className="form-control"
                      value={evFetalMovement}
                      onChange={(e) => setEvFetalMovement(e.target.value)}
                      placeholder="e.g. Present"
                    />
                  </div>
                </div>
              </div>

              {/* Fetal Biometry Block */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Biometry</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Groun Lump Length (Crown Rump Length - CRL)</label>
                    <div className="input-suffix-wrapper">
                      <input
                        type="text"
                        className="form-control"
                        value={evCrownRumpLengthCm}
                        onChange={(e) => setEvCrownRumpLengthCm(e.target.value)}
                        placeholder="e.g. 1.5"
                      />
                      <span className="input-suffix">cm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impression & Doctor Signature Block */}
              <div className="nt-block-card impression-card">
                <h4 className="nt-block-title">Impression & Doctor Signature</h4>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Impression</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={evImpression}
                    onChange={(e) => setEvImpression(e.target.value)}
                    placeholder="Enter radiological impression..."
                  />
                </div>

                <div className="form-group">
                  <label>Signature of the Doctor</label>
                  <select
                    className="form-control"
                    value={evDoctorSignature || radiologist}
                    onChange={(e) => setEvDoctorSignature(e.target.value)}
                  >
                    {doctorListOptions.map((doc, idx) => (
                      <option key={idx} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* Section 3C: GROWTH SCAN Detailed Inputs (Rendered when scanType === 'GROWTH' or contains 'GROWTH') */}
          {(scanType === 'GROWTH' || scanType.includes('GROWTH')) && (
            <div className="form-section nt-scan-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="section-title nt-title" style={{ margin: 0 }}>
                  <Activity size={18} className="title-icon" /> Growth Scan Detailed Clinical Findings & Biometry
                </h3>
                <button
                  type="button"
                  className="btn-save-print"
                  style={{ padding: '6px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0284c7' }}
                  onClick={handlePrintReportOnly}
                >
                  <Printer size={16} /> Print Report
                </button>
              </div>

              {/* Patient History Block */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Patient History</h4>
                <div className="form-group">
                  <label>Patient History</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={growthPatientHistory}
                    onChange={(e) => setGrowthPatientHistory(e.target.value)}
                    placeholder="Enter patient history..."
                  />
                </div>
              </div>

              {/* Fetal Survey Block */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Survey (Singleton Fetus)</h4>
                <div className="form-grid-3" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Presentation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={growthPresentation}
                      onChange={(e) => setGrowthPresentation(e.target.value)}
                      placeholder="e.g. Cephalic / Breech"
                    />
                  </div>

                  <div className="form-group">
                    <label>Placenta</label>
                    <input
                      type="text"
                      className="form-control"
                      value={growthPlacenta}
                      onChange={(e) => setGrowthPlacenta(e.target.value)}
                      placeholder="e.g. Anterior / Posterior / Fundal"
                    />
                  </div>

                  <div className="form-group">
                    <label>Liquor (AF I)</label>
                    <div className="input-suffix-wrapper">
                      <input
                        type="text"
                        className="form-control"
                        value={growthLiquor}
                        onChange={(e) => setGrowthLiquor(e.target.value)}
                        placeholder="e.g. 12"
                      />
                      <span className="input-suffix">cm</span>
                    </div>
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Fetal Movements</label>
                    <input
                      type="text"
                      className="form-control"
                      value={growthFetalMovements}
                      onChange={(e) => setGrowthFetalMovements(e.target.value)}
                      placeholder="e.g. Present / Active"
                    />
                  </div>

                  <div className="form-group">
                    <label>Cardiac Activity</label>
                    <input
                      type="text"
                      className="form-control"
                      value={growthCardiacActivity}
                      onChange={(e) => setGrowthCardiacActivity(e.target.value)}
                      placeholder="e.g. Present / Normal"
                    />
                  </div>

                  <div className="form-group">
                    <label>FHR (Fetal Heart Rate)</label>
                    <div className="input-suffix-wrapper">
                      <input
                        type="text"
                        className="form-control"
                        value={growthFhrBpm}
                        onChange={(e) => setGrowthFhrBpm(e.target.value)}
                        placeholder="e.g. 144"
                      />
                      <span className="input-suffix">BPM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fetal Biometry Table Block */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Biometry </h4>
                <div className="biometry-table-wrapper">
                  <table className="biometry-input-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50%' }}>Biometry</th>
                        <th style={{ width: '50%' }}>Measurement (in cms / grams)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Biparietal Diameter (BPD)</strong></td>
                        <td>
                          <div className="input-suffix-wrapper">
                            <input
                              type="text" className="form-control" placeholder="e.g. 7.2"
                              value={growthBpdCm} onChange={(e) => setGrowthBpdCm(e.target.value)}
                            />
                            <span className="input-suffix">cms</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Head Circumference (HC)</strong></td>
                        <td>
                          <div className="input-suffix-wrapper">
                            <input
                              type="text" className="form-control" placeholder="e.g. 26.5"
                              value={growthHcCm} onChange={(e) => setGrowthHcCm(e.target.value)}
                            />
                            <span className="input-suffix">cms</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>OFD (Occipitofrontal Diameter)</strong></td>
                        <td>
                          <div className="input-suffix-wrapper">
                            <input
                              type="text" className="form-control" placeholder="e.g. 9.1"
                              value={growthOfdCm} onChange={(e) => setGrowthOfdCm(e.target.value)}
                            />
                            <span className="input-suffix">cms</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Abdominal Circumference (AC)</strong></td>
                        <td>
                          <div className="input-suffix-wrapper">
                            <input
                              type="text" className="form-control" placeholder="e.g. 24.8"
                              value={growthAcCm} onChange={(e) => setGrowthAcCm(e.target.value)}
                            />
                            <span className="input-suffix">cms</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Femur Length (FL)</strong></td>
                        <td>
                          <div className="input-suffix-wrapper">
                            <input
                              type="text" className="form-control" placeholder="e.g. 5.4"
                              value={growthFlCm} onChange={(e) => setGrowthFlCm(e.target.value)}
                            />
                            <span className="input-suffix">cms</span>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Estimated Fetal Weight (EFW)</strong></td>
                        <td>
                          <input
                            type="text" className="form-control" placeholder="e.g. 1250 gms / 1.25 kg"
                            value={growthEfwGrams} onChange={(e) => setGrowthEfwGrams(e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Impression & Summary Card */}
              <div className="nt-block-card impression-card">
                <h4 className="nt-block-title">Impression & Summary</h4>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Impression</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={growthImpression}
                    onChange={(e) => setGrowthImpression(e.target.value)}
                    placeholder="Enter impression..."
                  />
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Liquor</label>
                    <input
                      type="text"
                      className="form-control"
                      value={growthImpressionLiquor}
                      onChange={(e) => setGrowthImpressionLiquor(e.target.value)}
                      placeholder="e.g. Adequate"
                    />
                  </div>

                  <div className="form-group">
                    <label>Presentation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={growthImpressionPresentation}
                      onChange={(e) => setGrowthImpressionPresentation(e.target.value)}
                      placeholder="e.g. Cephalic"
                    />
                  </div>

                  <div className="form-group">
                    <label>Placenta</label>
                    <input
                      type="text"
                      className="form-control"
                      value={growthImpressionPlacenta}
                      onChange={(e) => setGrowthImpressionPlacenta(e.target.value)}
                      placeholder="e.g. Anterior Grade II"
                    />
                  </div>
                </div>
              </div>

              {/* Statutory PNDT Declaration & Doctor Signature Block */}
              <div className="nt-block-card" style={{ borderLeft: '4px solid #ef4444', background: '#fff5f5' }}>
                <h4 className="nt-block-title" style={{ color: '#dc2626' }}>PC-PNDT Statutory Declaration & Doctor Signature</h4>
                <p style={{ fontSize: '13px', color: '#991b1b', fontStyle: 'italic', marginBottom: '16px', lineHeight: '1.5' }}>
                  "I (<strong>{growthDoctorSignature || radiologist || 'DR. G. SRI JANANI'}</strong>) declare that while conducting ultrasonography of <strong>{patientName || '__________________________'}</strong> I have neither detected nor disclosed the sex of the fetus."
                </p>

                <div className="form-group">
                  <label>Signature of the Doctor</label>
                  <select
                    className="form-control"
                    value={growthDoctorSignature || radiologist}
                    onChange={(e) => setGrowthDoctorSignature(e.target.value)}
                  >
                    {doctorListOptions.map((doc, idx) => (
                      <option key={idx} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* Section 3D: ABDOMEN KUB PELVIS Detailed Inputs (Rendered when scanType === 'ABDOMEN KUB PELVIS' or contains ABDOMEN/KUB) */}
          {(scanType === 'ABDOMEN KUB PELVIS' || scanType.includes('ABDOMEN') || scanType.includes('KUB')) && (
            <div className="form-section nt-scan-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="section-title nt-title" style={{ margin: 0 }}>
                  <Activity size={18} className="title-icon" /> Whole Abdomen, KUB & Pelvis Clinical Findings
                </h3>
                <button
                  type="button"
                  className="btn-save-print"
                  style={{ padding: '6px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0284c7' }}
                  onClick={handlePrintReportOnly}
                >
                  <Printer size={16} /> Print Report
                </button>
              </div>

              <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#e0f2fe', borderRadius: '6px', borderLeft: '4px solid #0284c7', fontSize: '13px', color: '#0369a1', fontWeight: 600 }}>
                Real time B-mode ultrasonography of Abdomen, KUB, Uterus and Ovaries done
              </div>

              {/* ABDOMEN SECTION */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Abdomen Evaluation</h4>
                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Liver</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={kubLiver}
                      onChange={(e) => setKubLiver(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Gall Bladder</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={kubGallBladder}
                      onChange={(e) => setKubGallBladder(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Common Duct</label>
                    <input
                      type="text"
                      className="form-control"
                      value={kubCommonDuct}
                      onChange={(e) => setKubCommonDuct(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Pancreas</label>
                    <input
                      type="text"
                      className="form-control"
                      value={kubPancreas}
                      onChange={(e) => setKubPancreas(e.target.value)}
                    />
                  </div>
                </div>

                {/* Pancreas Measurements */}
                <div className="form-grid-4" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Pancreas Head (cm)</label>
                    <input type="text" className="form-control" value={kubPancreasHead} onChange={(e) => setKubPancreasHead(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Pancreas Neck (cm)</label>
                    <input type="text" className="form-control" value={kubPancreasNeck} onChange={(e) => setKubPancreasNeck(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Pancreas Body (cm)</label>
                    <input type="text" className="form-control" value={kubPancreasBody} onChange={(e) => setKubPancreasBody(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Pancreas Tail (cm)</label>
                    <input type="text" className="form-control" value={kubPancreasTail} onChange={(e) => setKubPancreasTail(e.target.value)} />
                  </div>
                </div>

                <div className="form-grid-3" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Spleen</label>
                    <input type="text" className="form-control" value={kubSpleen} onChange={(e) => setKubSpleen(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Aorta</label>
                    <input type="text" className="form-control" value={kubAorta} onChange={(e) => setKubAorta(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Peritoneal Cavity Fluid</label>
                    <input type="text" className="form-control" value={kubFreeFluid} onChange={(e) => setKubFreeFluid(e.target.value)} />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Para Aortic Lymphadenopathy</label>
                    <input type="text" className="form-control" value={kubParaAorticNodes} onChange={(e) => setKubParaAorticNodes(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Adrenal Glands</label>
                    <input type="text" className="form-control" value={kubAdrenalGlands} onChange={(e) => setKubAdrenalGlands(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* KUB SECTION */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Kidney, Ureter & Bladder (KUB) Evaluation</h4>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Kidneys Cortex & Collecting System</label>
                  <input type="text" className="form-control" value={kubKidneysGeneral} onChange={(e) => setKubKidneysGeneral(e.target.value)} />
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Right Kidney Measurement (L x W cm)</label>
                    <input type="text" className="form-control" value={kubRightKidneySize} onChange={(e) => setKubRightKidneySize(e.target.value)} placeholder="9.5 x 3.4" />
                  </div>

                  <div className="form-group">
                    <label>Left Kidney Measurement (L x W cm)</label>
                    <input type="text" className="form-control" value={kubLeftKidneySize} onChange={(e) => setKubLeftKidneySize(e.target.value)} placeholder="10.4 x 4.4" />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Ureters</label>
                    <input type="text" className="form-control" value={kubUreters} onChange={(e) => setKubUreters(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Bladder</label>
                    <input type="text" className="form-control" value={kubBladder} onChange={(e) => setKubBladder(e.target.value)} />
                  </div>
                </div>

                <div className="form-grid-3" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Prevoid Bladder Measurement (L x W x H cm)</label>
                    <input type="text" className="form-control" value={kubPrevoidSize} onChange={(e) => setKubPrevoidSize(e.target.value)} placeholder="2.0 x 2.0 x 2.0" />
                  </div>

                  <div className="form-group">
                    <label>Prevoid Volume (cc)</label>
                    <input type="text" className="form-control" value={kubPrevoidVolume} onChange={(e) => setKubPrevoidVolume(e.target.value)} placeholder="4.0" />
                  </div>

                  <div className="form-group">
                    <label>Iliac Fossae</label>
                    <input type="text" className="form-control" value={kubIliacFossae} onChange={(e) => setKubIliacFossae(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Postvoid Bladder Emptying</label>
                  <input type="text" className="form-control" value={kubPostvoidStatus} onChange={(e) => setKubPostvoidStatus(e.target.value)} />
                </div>
              </div>

              {/* PELVIS SECTION */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Pelvis Evaluation (Transabdominal USG)</h4>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Uterus Status</label>
                  <input type="text" className="form-control" value={kubUterus} onChange={(e) => setKubUterus(e.target.value)} />
                </div>

                <div className="form-grid-3" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Uterus Size (L x W x H cm)</label>
                    <input type="text" className="form-control" value={kubUterusSize} onChange={(e) => setKubUterusSize(e.target.value)} placeholder="7.0 x 3.3 x 3.6" />
                  </div>

                  <div className="form-group">
                    <label>Cavity Echo</label>
                    <input type="text" className="form-control" value={kubCavityEcho} onChange={(e) => setKubCavityEcho(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Endometrial Thickness (mm)</label>
                    <input type="text" className="form-control" value={kubCavityThickness} onChange={(e) => setKubCavityThickness(e.target.value)} placeholder="6.0" />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Right Ovary Status</label>
                    <input type="text" className="form-control" value={kubRightOvary} onChange={(e) => setKubRightOvary(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Right Ovary Size (cm)</label>
                    <input type="text" className="form-control" value={kubRightOvarySize} onChange={(e) => setKubRightOvarySize(e.target.value)} placeholder="3.5 x 2.2" />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Left Ovary Status</label>
                    <input type="text" className="form-control" value={kubLeftOvary} onChange={(e) => setKubLeftOvary(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Left Ovary Size (cm)</label>
                    <input type="text" className="form-control" value={kubLeftOvarySize} onChange={(e) => setKubLeftOvarySize(e.target.value)} placeholder="2.9 x 1.9" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Both Adnexa</label>
                  <input type="text" className="form-control" value={kubAdnexa} onChange={(e) => setKubAdnexa(e.target.value)} />
                </div>
              </div>

              {/* IMPRESSION & DOCTOR SIGNATURE */}
              <div className="nt-block-card impression-card">
                <h4 className="nt-block-title">Impression & Doctor Signature</h4>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Impression</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={kubImpression}
                    onChange={(e) => setKubImpression(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Signature of the Doctor</label>
                  <select
                    className="form-control"
                    value={kubDoctorSignature || radiologist}
                    onChange={(e) => setKubDoctorSignature(e.target.value)}
                  >
                    {doctorListOptions.map((doc, idx) => (
                      <option key={idx} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* Section 3E: PELVIC SCAN Detailed Inputs (Rendered when scanType === 'PELVIC SCAN' or contains PELVIC) */}
          {(scanType === 'PELVIC SCAN' || scanType.includes('PELVIC')) && (
            <div className="form-section nt-scan-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="section-title nt-title" style={{ margin: 0 }}>
                  <Activity size={18} className="title-icon" /> Pelvic Ultrasound Detailed Clinical Findings
                </h3>
                <button
                  type="button"
                  className="btn-save-print"
                  style={{ padding: '6px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0284c7' }}
                  onClick={handlePrintReportOnly}
                >
                  <Printer size={16} /> Print Report
                </button>
              </div>

              <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#e0f2fe', borderRadius: '6px', borderLeft: '4px solid #0284c7', fontSize: '13px', color: '#0369a1', fontWeight: 600 }}>
                Transvaginal sonography of the pelvis done
              </div>

              {/* Patient History */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Patient History</h4>
                <div className="form-group">
                  <label>Patient History</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pelvicPatientHistory}
                    onChange={(e) => setPelvicPatientHistory(e.target.value)}
                    placeholder="e.g. AMENORRHEA"
                  />
                </div>
              </div>

              {/* Uterus & ET */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Uterus & Endometrial Cavity (ET)</h4>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Uterus Findings & Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={pelvicUterusDesc}
                    onChange={(e) => setPelvicUterusDesc(e.target.value)}
                  />
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Uterus Size (L x W x H cm)</label>
                    <input type="text" className="form-control" value={pelvicUterusSize} onChange={(e) => setPelvicUterusSize(e.target.value)} placeholder="4.9 x 3.48 x 3.44" />
                  </div>
                  <div className="form-group">
                    <label>Uterus Volume (cc)</label>
                    <input type="text" className="form-control" value={pelvicUterusVolume} onChange={(e) => setPelvicUterusVolume(e.target.value)} placeholder="31.278" />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Endometrial Cavity (ET) Description</label>
                    <input type="text" className="form-control" value={pelvicEtDesc} onChange={(e) => setPelvicEtDesc(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Endometrial Thickness (cm / mm)</label>
                    <input type="text" className="form-control" value={pelvicEtThickness} onChange={(e) => setPelvicEtThickness(e.target.value)} placeholder="6.08" />
                  </div>
                </div>
              </div>

              {/* Cervix & Ovaries */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Cervix & Ovaries Evaluation</h4>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Cervix</label>
                  <input type="text" className="form-control" value={pelvicCervix} onChange={(e) => setPelvicCervix(e.target.value)} />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label>Right Ovary Description</label>
                  <textarea className="form-control" rows={2} value={pelvicRightOvaryDesc} onChange={(e) => setPelvicRightOvaryDesc(e.target.value)} />
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Right Ovary Measurement (cm)</label>
                    <input type="text" className="form-control" value={pelvicRightOvarySize} onChange={(e) => setPelvicRightOvarySize(e.target.value)} placeholder="2.77 x 1.85 x 2.38" />
                  </div>
                  <div className="form-group">
                    <label>Right Ovary Volume (cc)</label>
                    <input type="text" className="form-control" value={pelvicRightOvaryVolume} onChange={(e) => setPelvicRightOvaryVolume(e.target.value)} placeholder="6.386" />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label>Left Ovary Description</label>
                  <textarea className="form-control" rows={2} value={pelvicLeftOvaryDesc} onChange={(e) => setPelvicLeftOvaryDesc(e.target.value)} />
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Left Ovary Measurement (cm)</label>
                    <input type="text" className="form-control" value={pelvicLeftOvarySize} onChange={(e) => setPelvicLeftOvarySize(e.target.value)} placeholder="2.33 x 1.43 x 1.80" />
                  </div>
                  <div className="form-group">
                    <label>Left Ovary Volume (cc)</label>
                    <input type="text" className="form-control" value={pelvicLeftOvaryVolume} onChange={(e) => setPelvicLeftOvaryVolume(e.target.value)} placeholder="3.140" />
                  </div>
                </div>

                <div className="form-group">
                  <label>POD (Pouch of Douglas)</label>
                  <input type="text" className="form-control" value={pelvicPod} onChange={(e) => setPelvicPod(e.target.value)} />
                </div>
              </div>

              {/* Impression & Doctor Signature */}
              <div className="nt-block-card impression-card">
                <h4 className="nt-block-title">Impression & Doctor Signature</h4>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Impression</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pelvicImpression}
                    onChange={(e) => setPelvicImpression(e.target.value)}
                    placeholder="e.g. BILATERAL PCOS"
                  />
                </div>

                <div className="form-group">
                  <label>Signature of the Doctor</label>
                  <select
                    className="form-control"
                    value={pelvicDoctorSignature || radiologist}
                    onChange={(e) => setPelvicDoctorSignature(e.target.value)}
                  >
                    {doctorListOptions.map((doc, idx) => (
                      <option key={idx} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* Section 3G: ANOMALY SCAN Detailed Inputs (Rendered when scanType === 'ANOMALY SCAN' or contains ANOMALY) */}
          {(scanType === 'ANOMALY SCAN' || scanType.includes('ANOMALY')) && (
            <div className="form-section nt-scan-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="section-title nt-title" style={{ margin: 0 }}>
                  <Activity size={18} className="title-icon" /> Fetal Anomaly USG Scan Detailed Clinical Findings
                </h3>
                <button
                  type="button"
                  className="btn-save-print"
                  style={{ padding: '6px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0284c7' }}
                  onClick={handlePrintReportOnly}
                >
                  <Printer size={16} /> Print Report
                </button>
              </div>

              {/* LMP & Gestation Box */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">LMP & Gestation Parameters</h4>
                <div className="form-grid-3" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>L.M.P Date</label>
                    <input type="text" className="form-control" value={anomalyLmpDate} onChange={(e) => setAnomalyLmpDate(e.target.value)} placeholder="25.03.2024" />
                  </div>
                  <div className="form-group">
                    <label>E.D.D as per L.M.P</label>
                    <input type="text" className="form-control" value={anomalyEddLmp} onChange={(e) => setAnomalyEddLmp(e.target.value)} placeholder="30.12.2024" />
                  </div>
                  <div className="form-group">
                    <label>Gestational Age (as per LMP)</label>
                    <input type="text" className="form-control" value={anomalyGestationalAgeLmp} onChange={(e) => setAnomalyGestationalAgeLmp(e.target.value)} placeholder="21 WEEKS 3 DAYS" />
                  </div>
                </div>

                <div className="form-grid-4">
                  <div className="form-group">
                    <label>Gestation</label>
                    <input type="text" className="form-control" value={anomalyGestation} onChange={(e) => setAnomalyGestation(e.target.value)} placeholder="Single fetus." />
                  </div>
                  <div className="form-group">
                    <label>Presentation</label>
                    <input type="text" className="form-control" value={anomalyPresentation} onChange={(e) => setAnomalyPresentation(e.target.value)} placeholder="Cephalic" />
                  </div>
                  <div className="form-group">
                    <label>Placenta</label>
                    <input type="text" className="form-control" value={anomalyPlacenta} onChange={(e) => setAnomalyPlacenta(e.target.value)} placeholder="Anterior ( Grade – I )" />
                  </div>
                  <div className="form-group">
                    <label>Liquor</label>
                    <input type="text" className="form-control" value={anomalyLiquor} onChange={(e) => setAnomalyLiquor(e.target.value)} placeholder="Adequate" />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Cervical Length (cms)</label>
                  <input type="text" className="form-control" value={anomalyCervicalLength} onChange={(e) => setAnomalyCervicalLength(e.target.value)} placeholder="3.3" style={{ maxWidth: '300px' }} />
                </div>
              </div>

              {/* Activity */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Activity & Heart Rate</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Fetal Activity & Movements</label>
                    <input type="text" className="form-control" value={anomalyActivity} onChange={(e) => setAnomalyActivity(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Heart Rate (FHR in BPM)</label>
                    <input type="text" className="form-control" value={anomalyFhrBpm} onChange={(e) => setAnomalyFhrBpm(e.target.value)} placeholder="141" />
                  </div>
                </div>
              </div>

              {/* Fetal Biometry (mms, WEEKS, DAYS) */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Biometry (mms, WEEKS, DAYS)</h4>
                <div className="biometry-table-wrapper" style={{ marginBottom: '16px' }}>
                  <table className="nt-biometry-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>BIOMETRY</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>MEASUREMENT (mms)</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>WEEKS</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>DAYS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px', fontWeight: 600 }}>BPD</td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyBpdMm} onChange={(e) => setAnomalyBpdMm(e.target.value)} /></td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyBpdWeeks} onChange={(e) => setAnomalyBpdWeeks(e.target.value)} /></td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyBpdDays} onChange={(e) => setAnomalyBpdDays(e.target.value)} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', fontWeight: 600 }}>HC</td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyHcMm} onChange={(e) => setAnomalyHcMm(e.target.value)} /></td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyHcWeeks} onChange={(e) => setAnomalyHcWeeks(e.target.value)} /></td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyHcDays} onChange={(e) => setAnomalyHcDays(e.target.value)} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', fontWeight: 600 }}>AC</td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyAcMm} onChange={(e) => setAnomalyAcMm(e.target.value)} /></td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyAcWeeks} onChange={(e) => setAnomalyAcWeeks(e.target.value)} /></td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyAcDays} onChange={(e) => setAnomalyAcDays(e.target.value)} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', fontWeight: 600 }}>FL</td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyFlMm} onChange={(e) => setAnomalyFlMm(e.target.value)} /></td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyFlWeeks} onChange={(e) => setAnomalyFlWeeks(e.target.value)} /></td>
                        <td style={{ padding: '8px' }}><input type="text" className="form-control" value={anomalyFlDays} onChange={(e) => setAnomalyFlDays(e.target.value)} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="form-group">
                  <label>Estimated Fetal Weight (E. F WT.)</label>
                  <input type="text" className="form-control" value={anomalyEfwGrams} onChange={(e) => setAnomalyEfwGrams(e.target.value)} placeholder="346 +/- 51 GRAMS" />
                </div>
              </div>

              {/* System-by-System Check */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Anomaly Evaluation (Organ Systems)</h4>
                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>BRAIN</label>
                    <textarea className="form-control" rows={3} value={anomalyBrain} onChange={(e) => setAnomalyBrain(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>CHEST</label>
                    <textarea className="form-control" rows={3} value={anomalyChest} onChange={(e) => setAnomalyChest(e.target.value)} />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>ABDOMEN</label>
                    <textarea className="form-control" rows={3} value={anomalyAbdomen} onChange={(e) => setAnomalyAbdomen(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>FACE</label>
                    <textarea className="form-control" rows={3} value={anomalyFace} onChange={(e) => setAnomalyFace(e.target.value)} />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>HEART</label>
                    <textarea className="form-control" rows={3} value={anomalyHeart} onChange={(e) => setAnomalyHeart(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>SPINE</label>
                    <textarea className="form-control" rows={3} value={anomalySpine} onChange={(e) => setAnomalySpine(e.target.value)} />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>ORBITS</label>
                    <textarea className="form-control" rows={3} value={anomalyOrbits} onChange={(e) => setAnomalyOrbits(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>SKELETON</label>
                    <textarea className="form-control" rows={3} value={anomalySkeleton} onChange={(e) => setAnomalySkeleton(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Umbilical Cord & Doppler</label>
                  <textarea className="form-control" rows={2} value={anomalyUmbilicalCord} onChange={(e) => setAnomalyUmbilicalCord(e.target.value)} />
                </div>
              </div>

              {/* Impression & Doctor Certification */}
              <div className="nt-block-card impression-card">
                <h4 className="nt-block-title">Impression & Doctor Credentials</h4>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Impression</label>
                  <textarea className="form-control" rows={4} value={anomalyImpression} onChange={(e) => setAnomalyImpression(e.target.value)} />
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>E.D.D as per USG</label>
                    <input type="text" className="form-control" value={anomalyEddUsg} onChange={(e) => setAnomalyEddUsg(e.target.value)} placeholder="05.01.2025" />
                  </div>

                  <div className="form-group">
                    <label>Signature of the Doctor</label>
                    <select
                      className="form-control"
                      value={anomalyDoctorSignature || radiologist}
                      onChange={(e) => setAnomalyDoctorSignature(e.target.value)}
                    >
                      {doctorListOptions.map((doc, idx) => (
                        <option key={idx} value={doc}>{doc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>FMF ID / Credentials</label>
                    <input type="text" className="form-control" value={anomalyFmfId} onChange={(e) => setAnomalyFmfId(e.target.value)} placeholder="FMF ID:214059" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Section 3H: Generic Scan Findings Inputs (for other scans) */}
          {scanType !== 'NT SCAN' && !scanType.includes('EARLY') && scanType !== 'EARLY-VIABILTY' && scanType !== 'EARLY VIABILITY' && scanType !== 'GROWTH' && !scanType.includes('GROWTH') && scanType !== 'ABDOMEN KUB PELVIS' && !scanType.includes('ABDOMEN') && !scanType.includes('KUB') && scanType !== 'PELVIC SCAN' && !scanType.includes('PELVIC') && scanType !== 'ANOMALY SCAN' && !scanType.includes('ANOMALY') && (
            <div className="form-section nt-scan-section">
              <h3 className="section-title nt-title">
                <Activity size={18} className="title-icon" /> Clinical Findings & Impression ({scanType})
              </h3>
              <div className="nt-block-card impression-card">
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Detailed Findings & Impression</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={genericFindings}
                    onChange={(e) => setGenericFindings(e.target.value)}
                    placeholder={`Enter clinical findings, measurements, and impression for ${scanType}...`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Upload Scan Image / Attachment */}
          <div className="form-section">
            <h3 className="section-title">
              <Image size={18} className="title-icon" /> Upload Scan Image / Digital Medical File
            </h3>

            <div className="scan-image-upload-box">
              {!scanImagePreview ? (
                <div
                  className="file-dropzone-large"
                  onClick={() => document.getElementById('page-scan-file-input')?.click()}
                >
                  <Upload size={36} color="#0284c7" className="dropzone-icon" />
                  <h4>Click here or drag & drop to attach USG Scan Image / DICOM / PDF File</h4>
                  <p>Supports PNG, JPG, DICOM, and PDF scan images for digital archiving & printing</p>
                  <input
                    type="file"
                    id="page-scan-file-input"
                    accept="image/*,.pdf,.dcm"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </div>
              ) : (
                <div className="scan-image-preview-card">
                  <div className="preview-image-wrapper">
                    <img src={scanImagePreview} alt="Scan Upload Preview" className="scan-preview-img" />
                  </div>
                  <div className="preview-info-side">
                    <div className="file-name-heading">
                      <FileText size={18} color="#0284c7" />
                      <strong>{fileName || 'Attached_Scan_Image.png'}</strong>
                    </div>
                    <span className="file-status-badge"><CheckCircle size={14} /> Image Attached & Saved</span>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="btn-change-img"
                        onClick={() => document.getElementById('page-scan-file-input')?.click()}
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        className="btn-remove-img"
                        onClick={removeImage}
                      >
                        <Trash2 size={14} /> Remove Image
                      </button>
                    </div>
                  </div>
                  <input
                    type="file"
                    id="page-scan-file-input"
                    accept="image/*,.pdf,.dcm"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions-bar">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/scan')}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn-save-print"
              style={{ backgroundColor: '#0284c7' }}
              onClick={handlePrintReportOnly}
            >
              <Printer size={18} /> Print Report
            </button>

            <button
              type="button"
              className="btn-save-print"
              onClick={handleSaveAndPrint}
            >
              <Printer size={18} /> Save & Print Report
            </button>

            <button
              type="submit"
              className="btn-save-report"
            >
              <CheckCircle size={18} /> Save Scan Report
            </button>
          </div>

        </form>
      </div>

      {/* --- PRINTABLE SCAN REPORT MODAL --- */}
      {showPrintModal && savedScanForPrint && (
        <div className="modal-overlay printable-scan-modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
          <div className="card printable-scan-modal-card" style={{ width: '800px', padding: '36px', background: 'white', position: 'relative', borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>

            {/* Top Close Button (Screen Only) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button
                type="button"
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setShowPrintModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* --- PROFESSIONAL HOSPITAL LETTERHEAD HEADER --- */}
            <div style={{ textAlign: 'center', borderBottom: '3px double #0284c7', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '6px' }}>
                <div style={{ background: '#0284c7', color: 'white', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)' }}>
                  <Activity size={28} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h1 style={{ margin: 0, color: '#0369a1', fontSize: '22px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                    SHREE JANANI HOSPITAL & DIAGNOSTICS
                  </h1>
                  <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                    DEPARTMENT OF ULTRASONOGRAPHY & RADIOLOGY IMAGING
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                No. 12, Hospital Main Road, Opp. Bus Stand | Phone: +91 9876543210 | Emergency: 044-23456789
              </div>
            </div>

            {/* --- PATIENT DEMOGRAPHICS & EXAMINATION DETAILS GRID --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 16px', fontSize: '12px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div>
                <strong style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Patient Name</strong>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{savedScanForPrint.patientName}</div>
              </div>
              <div>
                <strong style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>UHID / Reg No</strong>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7', marginTop: '2px' }}>{savedScanForPrint.uhid}</div>
              </div>
              <div>
                <strong style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Date of Exam</strong>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>{savedScanForPrint.date}</div>
              </div>
              <div>
                <strong style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Scan ID</strong>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>{savedScanForPrint.id}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Scan Modality</strong>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1', marginTop: '2px' }}>{savedScanForPrint.scanType}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Consulting Radiologist</strong>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{savedScanForPrint.radiologist || radiologist}</div>
              </div>
            </div>

            {/* Scan Image Preview in Print Slip */}
            {scanImagePreview && (
              <div style={{ textAlign: 'center', marginBottom: '24px', border: '1px solid #cbd5e1', padding: '14px', borderRadius: '8px', background: '#f0f9ff' }}>
                <strong style={{ display: 'block', fontSize: '11px', color: '#0369a1', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ATTACHED ULTRASOUND SCAN IMAGE
                </strong>
                <img src={scanImagePreview} alt="Scan Image" style={{ maxHeight: '260px', borderRadius: '6px', border: '1px solid #94a3b8', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </div>
            )}

            {/* --- REPORT BODY BY SCAN MODALITY --- */}
            {(savedScanForPrint.scanType === 'GROWTH' || savedScanForPrint.scanType.includes('GROWTH')) ? (
              <div className="printable-growth-report" style={{ border: '1px solid #cbd5e1', padding: '24px', borderRadius: '8px', background: 'white', fontFamily: 'Inter, sans-serif', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '8px', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#0284c7', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    OBSTETRIC GROWTH ULTRASOUND SCAN REPORT
                  </h3>
                </div>

                {/* Patient History */}
                <div style={{ marginBottom: '14px', fontSize: '13px', color: '#334155' }}>
                  <strong>PATIENT HISTORY:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{growthPatientHistory || '________'}</span>
                </div>

                {/* Fetal Survey */}
                <div style={{ marginBottom: '18px', background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ margin: '0 0 10px 0', color: '#0369a1', fontSize: '12px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>
                    FETAL SURVEY (SINGLETON FETUS)
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: '13px', color: '#334155' }}>
                    <div><strong>Presentation:</strong> {growthPresentation || '_______'}</div>
                    <div><strong>Placenta:</strong> {growthPlacenta || '_______'}</div>
                    <div><strong>Liquor:</strong> {growthLiquor ? `${growthLiquor} cm` : '_________cm'}</div>
                    <div><strong>Fetal Movements:</strong> {growthFetalMovements || '______'}</div>
                    <div><strong>Cardiac Activity:</strong> {growthCardiacActivity || '_________'}</div>
                    <div><strong>FHR:</strong> {growthFhrBpm ? `${growthFhrBpm} BPM` : '_______BPM'}</div>
                  </div>
                </div>

                {/* FETAL BIOMETRY TABLE */}
                <div style={{ marginBottom: '20px' }}>
                  <h5 style={{ margin: '0 0 10px 0', color: '#0369a1', fontSize: '12px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>
                    FETAL BIOMETRY (MEASUREMENTS)
                  </h5>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #cbd5e1' }}>
                    <thead>
                      <tr style={{ background: '#0284c7', color: 'white' }}>
                        <th style={{ padding: '8px 14px', textAlign: 'left', width: '50%', fontWeight: 700, fontSize: '12px', letterSpacing: '0.5px' }}>BIOMETRY PARAMETER</th>
                        <th style={{ padding: '8px 14px', textAlign: 'left', width: '50%', fontWeight: 700, fontSize: '12px', letterSpacing: '0.5px' }}>MEASUREMENT (IN CMS / GRAMS)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                        <td style={{ padding: '8px 14px', borderRight: '1px solid #cbd5e1', fontWeight: 600 }}>Biparietal Diameter (BPD)</td>
                        <td style={{ padding: '8px 14px', fontWeight: 700, color: '#0369a1' }}>{growthBpdCm ? `${growthBpdCm} cms` : '____ cms'}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <td style={{ padding: '8px 14px', borderRight: '1px solid #cbd5e1', fontWeight: 600 }}>Head Circumference (HC)</td>
                        <td style={{ padding: '8px 14px', fontWeight: 700, color: '#0369a1' }}>{growthHcCm ? `${growthHcCm} cms` : '_______cms'}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                        <td style={{ padding: '8px 14px', borderRight: '1px solid #cbd5e1', fontWeight: 600 }}>Occipitofrontal Diameter (OFD)</td>
                        <td style={{ padding: '8px 14px', fontWeight: 700, color: '#0369a1' }}>{growthOfdCm ? `${growthOfdCm} cms` : '________cms'}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <td style={{ padding: '8px 14px', borderRight: '1px solid #cbd5e1', fontWeight: 600 }}>Abdominal Circumference (AC)</td>
                        <td style={{ padding: '8px 14px', fontWeight: 700, color: '#0369a1' }}>{growthAcCm ? `${growthAcCm} cms` : '_______cms'}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                        <td style={{ padding: '8px 14px', borderRight: '1px solid #cbd5e1', fontWeight: 600 }}>Femur Length (FL)</td>
                        <td style={{ padding: '8px 14px', fontWeight: 700, color: '#0369a1' }}>{growthFlCm ? `${growthFlCm} cms` : '_______cms'}</td>
                      </tr>
                      <tr style={{ background: '#f0f9ff' }}>
                        <td style={{ padding: '8px 14px', borderRight: '1px solid #cbd5e1', fontWeight: 700, color: '#0c4a6e' }}>Estimated Fetal Weight (EFW)</td>
                        <td style={{ padding: '8px 14px', fontWeight: 800, color: '#0284c7' }}>{growthEfwGrams || '_________'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Impression & Summary */}
                <div style={{ marginBottom: '18px', padding: '14px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px' }}>
                  <div style={{ marginBottom: '10px', fontSize: '13px' }}>
                    <strong style={{ color: '#0369a1' }}>IMPRESSION:</strong> <span style={{ fontWeight: 700, color: '#0c4a6e' }}>{growthImpression || '__________'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '12px', color: '#334155' }}>
                    <div><strong>Liquor:</strong> {growthImpressionLiquor || '___________'}</div>
                    <div><strong>Presentation:</strong> {growthImpressionPresentation || '____________'}</div>
                    <div><strong>Placenta:</strong> {growthImpressionPlacenta || '_____________'}</div>
                  </div>
                </div>

                {/* Statutory PC-PNDT Declaration */}
                <div style={{ marginTop: '16px', padding: '12px 14px', border: '1px solid #fca5a5', background: '#fff5f5', borderRadius: '6px', fontSize: '12px', color: '#991b1b', lineHeight: '1.6' }}>
                  I (<strong>{growthDoctorSignature || radiologist || 'DR. G. SRI JANANI'}</strong>) declare that while conducting ultrasonography of <strong>{savedScanForPrint.patientName || '__________________________'}</strong> I have neither detected nor disclosed the sex of the fetus.
                </div>

                {/* Doctor Signature */}
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Report Generated on {new Date().toLocaleDateString()} | SJH Radiology System
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '220px' }}>
                    <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '4px', marginBottom: '4px', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {growthDoctorSignature || radiologist || 'DR. G. SRI JANANI, MD (OG)'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Consulting Sonologist / Radiologist</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>Signature of the Doctor</div>
                  </div>
                </div>
              </div>
            ) : (savedScanForPrint.scanType === 'ABDOMEN KUB PELVIS' || savedScanForPrint.scanType.includes('ABDOMEN') || savedScanForPrint.scanType.includes('KUB')) ? (
              <div className="printable-kub-report" style={{ border: '1px solid #cbd5e1', padding: '24px', borderRadius: '8px', background: 'white', fontFamily: 'Inter, sans-serif', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '8px', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#0284c7', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    WHOLE ABDOMEN, KUB & PELVIS ULTRASOUND REPORT
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontStyle: 'italic' }}>
                    Real time B-mode ultrasonography of Abdomen, KUB, Uterus and Ovaries done
                  </div>
                </div>

                {/* ABDOMEN */}
                <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '12px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>Abdomen</h5>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: '1.6', color: '#334155' }}>
                    <li><strong>Liver:</strong> {kubLiver}</li>
                    <li><strong>Gall bladder:</strong> {kubGallBladder}</li>
                    <li><strong>Common duct:</strong> {kubCommonDuct}</li>
                    <li><strong>Pancreas:</strong> {kubPancreas} (Head: {kubPancreasHead} cm, Neck: {kubPancreasNeck} cm, Body: {kubPancreasBody} cm, Tail: {kubPancreasTail} cm)</li>
                    <li><strong>Spleen:</strong> {kubSpleen}</li>
                    <li><strong>Aorta:</strong> {kubAorta}</li>
                    <li><strong>Peritoneal Cavity:</strong> {kubFreeFluid}</li>
                    <li><strong>Lymphadenopathy:</strong> {kubParaAorticNodes}</li>
                    <li><strong>Adrenal glands:</strong> {kubAdrenalGlands}</li>
                  </ul>
                </div>

                {/* KUB */}
                <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '12px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>KUB</h5>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: '1.6', color: '#334155' }}>
                    <li>{kubKidneysGeneral}</li>
                    <li><strong>Right kidney measured:</strong> {kubRightKidneySize} cm</li>
                    <li><strong>Left kidney measured:</strong> {kubLeftKidneySize} cm</li>
                    <li>{kubUreters}</li>
                    <li>{kubBladder}</li>
                    <li><strong>Prevoid bladder measured:</strong> {kubPrevoidSize} cm (Volume = {kubPrevoidVolume}cc)</li>
                    <li>{kubPostvoidStatus}</li>
                    <li>{kubIliacFossae}</li>
                  </ul>
                </div>

                {/* PELVIS */}
                <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '12px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>Pelvis</h5>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontStyle: 'italic' }}>Transabdominal ultrasonography of the pelvis done.</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: '1.6', color: '#334155' }}>
                    <li>{kubUterus}</li>
                    <li><strong>Uterus measured:</strong> {kubUterusSize} cm</li>
                    <li>{kubCavityEcho} (Thickness = {kubCavityThickness} mm)</li>
                    <li>{kubRightOvary} (Measured {kubRightOvarySize} cm)</li>
                    <li>{kubLeftOvary} (Measured {kubLeftOvarySize} cm)</li>
                    <li>{kubAdnexa}</li>
                  </ul>
                </div>

                {/* IMPRESSION */}
                <div style={{ marginBottom: '18px', padding: '14px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px' }}>
                  <h5 style={{ margin: '0 0 6px 0', color: '#0369a1', fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px' }}>IMPRESSION</h5>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', fontWeight: 700, color: '#0c4a6e' }}>
                    {kubImpression}
                  </p>
                </div>

                {/* Doctor Signature */}
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Report Generated on {new Date().toLocaleDateString()} | SJH Radiology System
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '220px' }}>
                    <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '4px', marginBottom: '4px', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {kubDoctorSignature || radiologist || 'DR. G. SRI JANANI, MD (OG)'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Consulting Sonologist / Radiologist</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>Signature of the Doctor</div>
                  </div>
                </div>
              </div>
            ) : (savedScanForPrint.scanType === 'PELVIC SCAN' || savedScanForPrint.scanType.includes('PELVIC')) ? (
              <div className="printable-pelvic-report" style={{ border: '1px solid #cbd5e1', padding: '24px', borderRadius: '8px', background: 'white', fontFamily: 'Inter, sans-serif', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '8px', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#0284c7', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    PELVIS ULTRASOUND SCAN REPORT
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontStyle: 'italic' }}>
                    Transvaginal sonography of the pelvis done
                  </div>
                </div>

                {/* Patient History */}
                <div style={{ marginBottom: '14px', fontSize: '13px', color: '#334155' }}>
                  <strong>PATIENT HISTORY:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{pelvicPatientHistory || 'AMENORRHEA'}</span>
                </div>

                {/* Organ Details List */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                  <div style={{ marginBottom: '12px', fontSize: '13px', lineHeight: '1.6' }}>
                    <strong style={{ color: '#0369a1' }}>UTERUS:</strong> {pelvicUterusDesc}
                    <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px', paddingLeft: '12px' }}>
                      Measured Approximately <strong>{pelvicUterusSize} cm</strong> (Volume: <strong>{pelvicUterusVolume} cc</strong>)
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px', fontSize: '13px', lineHeight: '1.6' }}>
                    <strong style={{ color: '#0369a1' }}>ET:</strong> {pelvicEtDesc} measured <strong>{pelvicEtThickness} cm</strong>
                  </div>

                  <div style={{ marginBottom: '12px', fontSize: '13px', lineHeight: '1.6' }}>
                    <strong style={{ color: '#0369a1' }}>CERVIX:</strong> {pelvicCervix}
                  </div>

                  <div style={{ marginBottom: '12px', fontSize: '13px', lineHeight: '1.6' }}>
                    <strong style={{ color: '#0369a1' }}>RIGHT OVARY:</strong> {pelvicRightOvaryDesc}
                    <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px', paddingLeft: '12px' }}>
                      Measures Approximately <strong>{pelvicRightOvarySize} cm</strong> (Volume: <strong>{pelvicRightOvaryVolume} cc</strong>)
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px', fontSize: '13px', lineHeight: '1.6' }}>
                    <strong style={{ color: '#0369a1' }}>LEFT OVARY:</strong> {pelvicLeftOvaryDesc}
                    <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px', paddingLeft: '12px' }}>
                      Measures Approximately <strong>{pelvicLeftOvarySize} cm</strong> (Volume: <strong>{pelvicLeftOvaryVolume} cc</strong>)
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    <strong style={{ color: '#0369a1' }}>POD:</strong> {pelvicPod}
                  </div>
                </div>

                {/* Impression */}
                <div style={{ marginBottom: '18px', padding: '14px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px' }}>
                  <h5 style={{ margin: '0 0 6px 0', color: '#0369a1', fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px' }}>IMPRESSION</h5>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', fontWeight: 800, color: '#0c4a6e', letterSpacing: '0.5px' }}>
                    {pelvicImpression}
                  </p>
                </div>

                {/* Doctor Signature */}
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Report Generated on {new Date().toLocaleDateString()} | SJH Radiology System
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '220px' }}>
                    <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '4px', marginBottom: '4px', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {pelvicDoctorSignature || radiologist || 'DR. G. SRI JANANI, MD (OG)'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Consulting Sonologist / Radiologist</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>Signature of the Doctor</div>
                  </div>
                </div>
              </div>
            ) : (savedScanForPrint.scanType === 'ANOMALY SCAN' || savedScanForPrint.scanType.includes('ANOMALY')) ? (
              <div className="printable-anomaly-report" style={{ border: '1px solid #cbd5e1', padding: '24px', borderRadius: '8px', background: 'white', fontFamily: 'Inter, sans-serif', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '8px', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#0284c7', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    TARGETED FETAL ANOMALY ULTRASOUND SCAN REPORT
                  </h3>
                </div>

                {/* LMP & Gestation Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div><strong>L.M.P Date:</strong> {anomalyLmpDate}</div>
                  <div><strong>E.D.D as per L.M.P:</strong> {anomalyEddLmp}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Gestational age (as per LMP):</strong> <span style={{ fontWeight: 700, color: '#0369a1' }}>{anomalyGestationalAgeLmp}</span></div>
                  <div><strong>Gestation:</strong> {anomalyGestation}</div>
                  <div><strong>Presentation:</strong> {anomalyPresentation}</div>
                  <div><strong>Placenta:</strong> {anomalyPlacenta}</div>
                  <div><strong>Liquor:</strong> {anomalyLiquor}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Cervical Length:</strong> {anomalyCervicalLength} cms</div>
                </div>

                {/* Activity & FHR Banner */}
                <div style={{ padding: '10px 14px', background: '#e0f2fe', borderRadius: '6px', borderLeft: '4px solid #0284c7', fontSize: '12px', color: '#0369a1', fontWeight: 700, display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span>ACTIVITY: {anomalyActivity}</span>
                  <span>HR: {anomalyFhrBpm} BPM</span>
                </div>

                {/* BIOMETRY TABLE */}
                <div style={{ marginBottom: '18px' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '12px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>
                    FETAL BIOMETRY (MEASUREMENTS)
                  </h5>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', border: '1px solid #cbd5e1' }}>
                    <thead>
                      <tr style={{ background: '#0284c7', color: 'white' }}>
                        <th style={{ padding: '6px 12px', textAlign: 'left', width: '30%', fontWeight: 700 }}>BIOMETRY</th>
                        <th style={{ padding: '6px 12px', textAlign: 'left', width: '30%', fontWeight: 700 }}>MEASUREMENT (mms)</th>
                        <th style={{ padding: '6px 12px', textAlign: 'left', width: '20%', fontWeight: 700 }}>WEEKS</th>
                        <th style={{ padding: '6px 12px', textAlign: 'left', width: '20%', fontWeight: 700 }}>DAYS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1', fontWeight: 700 }}>BPD</td>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1', color: '#0369a1', fontWeight: 700 }}>{anomalyBpdMm}</td>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1' }}>{anomalyBpdWeeks}</td>
                        <td style={{ padding: '6px 12px' }}>{anomalyBpdDays}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1', fontWeight: 700 }}>HC</td>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1', color: '#0369a1', fontWeight: 700 }}>{anomalyHcMm}</td>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1' }}>{anomalyHcWeeks}</td>
                        <td style={{ padding: '6px 12px' }}>{anomalyHcDays}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1', fontWeight: 700 }}>AC</td>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1', color: '#0369a1', fontWeight: 700 }}>{anomalyAcMm}</td>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1' }}>{anomalyAcWeeks}</td>
                        <td style={{ padding: '6px 12px' }}>{anomalyAcDays}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1', fontWeight: 700 }}>FL</td>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1', color: '#0369a1', fontWeight: 700 }}>{anomalyFlMm}</td>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1' }}>{anomalyFlWeeks}</td>
                        <td style={{ padding: '6px 12px' }}>{anomalyFlDays}</td>
                      </tr>
                      <tr style={{ background: '#f0f9ff' }}>
                        <td style={{ padding: '6px 12px', borderRight: '1px solid #cbd5e1', fontWeight: 800, color: '#0c4a6e' }}>E. F WT.</td>
                        <td colSpan={3} style={{ padding: '6px 12px', fontWeight: 800, color: '#0284c7' }}>{anomalyEfwGrams}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SYSTEMIC ANOMALY CHECK */}
                <div style={{ marginBottom: '18px', background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ margin: '0 0 10px 0', color: '#0369a1', fontSize: '12px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>
                    FETAL ANOMALY EVALUATION (SYSTEMIC)
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', fontSize: '12px', lineHeight: '1.5', color: '#334155' }}>
                    <div><strong style={{ color: '#0369a1' }}>BRAIN:</strong> <div style={{ whiteSpace: 'pre-line' }}>{anomalyBrain}</div></div>
                    <div><strong style={{ color: '#0369a1' }}>CHEST:</strong> <div style={{ whiteSpace: 'pre-line' }}>{anomalyChest}</div></div>
                    <div><strong style={{ color: '#0369a1' }}>ABDOMEN:</strong> <div style={{ whiteSpace: 'pre-line' }}>{anomalyAbdomen}</div></div>
                    <div><strong style={{ color: '#0369a1' }}>FACE:</strong> <div style={{ whiteSpace: 'pre-line' }}>{anomalyFace}</div></div>
                    <div><strong style={{ color: '#0369a1' }}>HEART:</strong> <div style={{ whiteSpace: 'pre-line' }}>{anomalyHeart}</div></div>
                    <div><strong style={{ color: '#0369a1' }}>SPINE:</strong> <div style={{ whiteSpace: 'pre-line' }}>{anomalySpine}</div></div>
                    <div><strong style={{ color: '#0369a1' }}>ORBITS:</strong> <div style={{ whiteSpace: 'pre-line' }}>{anomalyOrbits}</div></div>
                    <div><strong style={{ color: '#0369a1' }}>SKELETON:</strong> <div style={{ whiteSpace: 'pre-line' }}>{anomalySkeleton}</div></div>
                    <div style={{ gridColumn: 'span 2' }}><strong style={{ color: '#0369a1' }}>UMBILICAL CORD & DOPPLER:</strong> <div style={{ whiteSpace: 'pre-line' }}>{anomalyUmbilicalCord}</div></div>
                  </div>
                </div>

                {/* IMPRESSION */}
                <div style={{ marginBottom: '16px', padding: '14px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px' }}>
                  <h5 style={{ margin: '0 0 6px 0', color: '#0369a1', fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px' }}>IMPRESSION</h5>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', fontWeight: 700, color: '#0c4a6e', whiteSpace: 'pre-line' }}>
                    {anomalyImpression}
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>
                    E.D.D as per USG: {anomalyEddUsg}
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginBottom: '20px' }}>
                  Note: All fetal anomalies could not be detected as it depends on fetal position and amniotic fluid at the time of scan.
                </div>

                {/* Doctor Signature */}
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Report Generated on {new Date().toLocaleDateString()} | SJH Radiology System
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '240px' }}>
                    <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '4px', marginBottom: '4px', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {anomalyDoctorSignature || radiologist || 'DR.M.MURALI GANESH, M.B.B.S DNB (RD)'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>{anomalyFmfId || 'FMF ID:214059'}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>Signature of the Doctor</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ border: '1px solid #cbd5e1', padding: '24px', borderRadius: '8px', marginBottom: '24px', background: 'white' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, textTransform: 'uppercase' }}>
                  <ShieldCheck size={18} /> RADIOLOGICAL IMPRESSION & DETAILED FINDINGS
                </h4>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-line', fontFamily: 'Inter, sans-serif' }}>
                  {savedScanForPrint.findings}
                </p>

                {/* Doctor Signature */}
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Report Generated on {new Date().toLocaleDateString()} | SJH Radiology System
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '220px' }}>
                    <div style={{ borderBottom: '1px solid #94a3b8', paddingBottom: '4px', marginBottom: '4px', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                      {savedScanForPrint.radiologist || radiologist || 'DR. G. SRI JANANI, MD (OG)'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Consulting Sonologist / Radiologist</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>Signature of the Doctor</div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Control Bar (Screen Mode Only) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Verified by <strong>{savedScanForPrint.radiologist || radiologist}</strong>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-cancel" onClick={() => { setShowPrintModal(false); navigate('/scan'); }}>
                  Done & Return to Scans
                </button>
                <button
                  className="btn-save-print"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', boxShadow: '0 4px 12px rgba(2,132,199,0.3)' }}
                  onClick={() => window.print()}
                >
                  <Printer size={18} /> Print Report Slip
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default UploadScanReportPage;
