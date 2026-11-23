import React, { useState } from 'react';
import { IssueCategory, IssueUrgency, CivicIssueReport } from '../types';
import { ISSUE_CATEGORIES } from '../data/reportsData';
import { generateReportId, saveNewReport, formatReportDate } from '../utils/reportsStorage';
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Crosshair,
  Camera,
  Upload,
  X,
  ArrowLeft,
  Send,
  Sparkles,
  ShieldAlert,
  Loader2,
  FileText,
} from 'lucide-react';

interface ReportIssueFormProps {
  onReturnHome: () => void;
  onViewMyReports: () => void;
  onReportSubmitted?: (report: CivicIssueReport) => void;
}

export const ReportIssueForm: React.FC<ReportIssueFormProps> = ({
  onReturnHome,
  onViewMyReports,
  onReportSubmitted,
}) => {
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory | ''>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [urgency, setUrgency] = useState<IssueUrgency>('Medium');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  // Form states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<CivicIssueReport | null>(null);

  // Mock sample photos for fast testing
  const samplePhotos = [
    {
      label: 'Sample Pothole',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Sample Streetlight',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Sample Sanitation',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    },
  ];

  // Location handler: simulates geolocation detection with realistic coordinates
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    // Simulate brief device GPS lookup
    setTimeout(() => {
      // Mock coordinates (Raipur / Central India region)
      const mockLat = 21.2514 + (Math.random() - 0.5) * 0.02;
      const mockLng = 81.6296 + (Math.random() - 0.5) * 0.02;

      setCoordinates({
        latitude: parseFloat(mockLat.toFixed(4)),
        longitude: parseFloat(mockLng.toFixed(4)),
      });
      setLocationDetected(true);
      setIsLocating(false);

      if (!location.trim()) {
        setLocation('Ward 18, G.E. Road, near Central Civic Square, Raipur');
      }

      // Clear any location error
      if (errors.location) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.location;
          return next;
        });
      }
    }, 600);
  };

  // Photo file upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Please select a valid image file (.jpg, .jpeg, .png, .webp).',
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Image size must be less than 5MB.',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
      setPhotoName(file.name);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.photo;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    setPhotoName(null);
  };

  // Validation function
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Please provide a clear title for the issue.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters.';
    }

    if (!category) {
      newErrors.category = 'Please select an issue category.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please describe the problem and its public impact.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Description should provide at least 15 characters of detail.';
    }

    if (!location.trim()) {
      newErrors.location = 'Please specify the street, landmark, or area of the incident.';
    } else if (location.trim().length < 5) {
      newErrors.location = 'Location must be at least 5 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const reportId = generateReportId();
      const newReport: CivicIssueReport = {
        id: reportId,
        title: title.trim(),
        category: category as IssueCategory,
        description: description.trim(),
        location: location.trim(),
        coordinates: coordinates || {
          latitude: 21.2514,
          longitude: 81.6296,
        },
        urgency,
        status: 'Submitted',
        createdAt: new Date().toISOString(),
        photoUrl: photoUrl || undefined,
        departmentAssigned: mapCategoryToDepartment(category as IssueCategory),
        statusUpdates: [
          {
            status: 'Submitted',
            timestamp: new Date().toISOString(),
            note: 'Civic grievance registered successfully. Notification sent to zonal desk.',
          },
        ],
      };

      saveNewReport(newReport);
      setSubmittedReport(newReport);
      setIsSubmitting(false);

      if (onReportSubmitted) {
        onReportSubmitted(newReport);
      }
    }, 700);
  };

  const handleResetForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setLocation('');
    setCoordinates(null);
    setLocationDetected(false);
    setUrgency('Medium');
    setPhotoUrl(null);
    setPhotoName(null);
    setErrors({});
    setSubmittedReport(null);
  };

  // Quick preset test filler
  const handlePrefillDemo = () => {
    setTitle('Deep dangerous pothole near pedestrian crossing');
    setCategory('Roads & Potholes');
    setDescription('Two-wheeler riders are losing control due to an uncovered 8-inch deep crater right where pedestrians cross opposite the state library gate.');
    setLocation('Opposite Central State Library, G.E. Road, Ward 14');
    setCoordinates({ latitude: 21.2482, longitude: 81.6341 });
    setLocationDetected(true);
    setUrgency('High');
    setPhotoUrl('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80');
    setPhotoName('pothole_crossing_ward14.jpg');
    setErrors({});
  };

  // Success view
  if (submittedReport) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onReturnHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
          <span className="text-xs text-slate-400">Civic Grievance # {submittedReport.id}</span>
        </div>

        {/* Success Card */}
        <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border-4 border-emerald-50 dark:border-emerald-900/40">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Report Submitted Successfully
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Grievance Registered with CivicSeva
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Your community report has been logged and assigned a unique tracking identifier. You can follow progress updates in the <strong>My Reports</strong> section.
            </p>
          </div>

          {/* Generated ID Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 max-w-md mx-auto space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Official Tracking Reference ID
            </span>
            <div className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-400 font-mono tracking-wider">
              {submittedReport.id}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Logged on {formatReportDate(submittedReport.createdAt)}
            </span>
          </div>

          {/* Report Summary Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-left text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Category</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{submittedReport.category}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Urgency Priority</span>
              <span className={`font-bold mt-0.5 inline-flex items-center gap-1 ${
                submittedReport.urgency === 'High'
                  ? 'text-rose-600 dark:text-rose-400'
                  : submittedReport.urgency === 'Medium'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {submittedReport.urgency}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Location</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-1 block" title={submittedReport.location}>
                {submittedReport.location}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onViewMyReports}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Track in My Reports</span>
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
            >
              <Camera className="w-4 h-4" />
              <span>Report Another Issue</span>
            </button>
            <button
              type="button"
              onClick={onReturnHome}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
            >
              <span>Return to Homepage</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={onReturnHome}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Report an Issue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Report a Civic Grievance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Report local civic infrastructure defects directly to relevant municipal and utility departments.
          </p>
        </div>

        {/* View My Reports quick button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrefillDemo}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition"
            title="Auto-fill with sample issue data for fast testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Fill Demo Data</span>
            <span className="sm:hidden">Demo</span>
          </button>
          <button
            type="button"
            onClick={onViewMyReports}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-700 transition"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>My Reports</span>
          </button>
        </div>
      </div>

      {/* Main Report Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6"
      >
        {/* 1. Issue Title */}
        <div className="space-y-1.5">
          <label htmlFor="issue-title" className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Issue Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="issue-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            placeholder="e.g. Deep pothole cluster near primary school gate"
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
              errors.title
                ? 'border-rose-400 focus:ring-rose-200 dark:border-rose-700'
                : 'border-slate-200 dark:border-zinc-800 focus:border-blue-600 focus:ring-blue-600/10'
            }`}
          />
          {errors.title && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* 2. Issue Category Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="issue-category" className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="issue-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as IssueCategory);
              if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
            }}
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition cursor-pointer ${
              errors.category
                ? 'border-rose-400 focus:ring-rose-200 dark:border-rose-700'
                : 'border-slate-200 dark:border-zinc-800 focus:border-blue-600 focus:ring-blue-600/10'
            }`}
          >
            <option value="" disabled>Select an issue category...</option>
            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.category}</span>
            </p>
          )}
        </div>

        {/* 3. Description */}
        <div className="space-y-1.5">
          <label htmlFor="issue-description" className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="issue-description"
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            placeholder="Describe the exact location, magnitude, hazard to pedestrians or traffic, and how long the issue has persisted..."
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
              errors.description
                ? 'border-rose-400 focus:ring-rose-200 dark:border-rose-700'
                : 'border-slate-200 dark:border-zinc-800 focus:border-blue-600 focus:ring-blue-600/10'
            }`}
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Minimum 15 characters</span>
            <span>{description.length} chars</span>
          </div>
          {errors.description && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* 4. Polished Location Section */}
        <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label htmlFor="issue-location" className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Incident Location & Landmark <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Specify street name, landmark, colony, or use device GPS.
              </p>
            </div>

            {/* "Use Current Location" Button */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/70 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-zinc-700 text-xs font-semibold transition cursor-pointer shadow-2xs shrink-0"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Crosshair className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Use Current Location</span>
                </>
              )}
            </button>
          </div>

          {/* Location Input Field */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              id="issue-location"
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
              }}
              placeholder="e.g. Ward 14, G.E. Road, near State Library, Raipur"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.location
                  ? 'border-rose-400 focus:ring-rose-200 dark:border-rose-700'
                  : 'border-slate-200 dark:border-zinc-800 focus:border-blue-600 focus:ring-blue-600/10'
              }`}
            />
          </div>

          {/* Location Visual Confirmation & Mock Lat/Long Banner */}
          {coordinates && locationDetected && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold">GPS Coordinates Captured:</span>{' '}
                  <span className="font-mono">{coordinates.latitude}° N, {coordinates.longitude}° E</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                Mock Geotagged
              </span>
            </div>
          )}

          {errors.location && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.location}</span>
            </p>
          )}
        </div>

        {/* 5. Photo Upload with Preview */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Attach Evidence Photo <span className="text-slate-400 font-normal text-[11px]">(Optional but Recommended)</span>
          </label>

          {photoUrl ? (
            /* Uploaded Photo Preview Card */
            <div className="relative rounded-2xl border border-slate-200 dark:border-zinc-800 p-3 bg-slate-50 dark:bg-zinc-900/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={photoUrl}
                  alt="Issue preview"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-zinc-800 shrink-0 shadow-2xs"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {photoName || 'Captured evidence image'}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Ready for submission</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition"
                aria-label="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Upload Drop Area */
            <div>
              <label
                htmlFor="photo-upload-input"
                className="border-2 border-dashed border-slate-300 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition text-center"
              >
                <div className="p-3 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Click to upload photo</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> or drag and drop</span>
                </div>
                <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB</span>
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Sample Photo Presets for Quick Testing */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px]">
                <span className="text-slate-400 font-medium">Or attach test sample:</span>
                {samplePhotos.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => {
                      setPhotoUrl(sample.url);
                      setPhotoName(sample.label);
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/70 text-slate-700 dark:text-slate-300 hover:text-blue-700 border border-slate-200 dark:border-zinc-700 transition"
                  >
                    + {sample.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errors.photo && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.photo}</span>
            </p>
          )}
        </div>

        {/* 6. Urgency Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Urgency Level <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['Low', 'Medium', 'High'] as IssueUrgency[]).map((level) => {
              const isSelected = urgency === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? level === 'High'
                        ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 dark:border-rose-700 text-rose-950 dark:text-rose-200 shadow-sm'
                        : level === 'Medium'
                        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 dark:border-amber-700 text-amber-950 dark:text-amber-200 shadow-sm'
                        : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{level} Urgency</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        level === 'High'
                          ? 'bg-rose-500'
                          : level === 'Medium'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {level === 'Low' && 'Routine maintenance defect.'}
                    {level === 'Medium' && 'Causes inconvenience or traffic slowdown.'}
                    {level === 'High' && 'Immediate public safety danger or flooding.'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Report Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
            <span>CivicSeva logs reports into local mock storage for fast tracking.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onReturnHome}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Grievance...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

function mapCategoryToDepartment(category: IssueCategory): string {
  switch (category) {
    case 'Roads & Potholes':
      return 'Municipal Road Maintenance & PWD Wing';
    case 'Streetlights':
      return 'Electrical Works & Streetlighting Cell';
    case 'Garbage & Sanitation':
      return 'Solid Waste Management & Public Health';
    case 'Water Supply':
      return 'Public Health Engineering Department (PHED)';
    case 'Public Buildings':
      return 'Civic Infrastructure & Public Works Department';
    case 'Drainage':
      return 'Municipal Drainage & Sewerage Division';
    case 'Other':
    default:
      return 'General Civic Grievance Redressal Cell';
  }
}
