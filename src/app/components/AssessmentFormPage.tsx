import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../auth/AuthContext";
import { checklistService } from "../../services/checklistService";
import { assessmentService } from "../../services/assessmentService";
import { ArrowLeft, Save, Send, Camera, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";

type ResponseType = "yes" | "no" | "partial";

interface AssessmentFormData {
  farmId: string;
  farmName: string;
  farmType: "Poultry" | "Pig" | "Cattle";
  assessmentType: "On Request" | "Regular" | "Follow Up" | "Complaint Based" | "Disease Outbreak";
  dzongkhag: string;
  gewog: string;
  responses: Record<string, ResponseType>;
  notes: Record<string, string>;
}

export function AssessmentFormPage({ assessmentId, onCancel, onSave }: {
  assessmentId?: string;
  onCancel: () => void;
  onSave: () => void;
}) {
  const { user } = useAuth();
  const [checklist, setChecklist] = useState<any>(null);
  const [formData, setFormData] = useState<AssessmentFormData>({
    farmId: "",
    farmName: "",
    farmType: "Poultry",
    assessmentType: "Regular",
    dzongkhag: "Thimphu",
    gewog: "",
    responses: {},
    notes: {},
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [currentScore, setCurrentScore] = useState({ totalScore: 0, maxScore: 0, percentage: 0, complianceStatus: "Non-compliant" as any });
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const poultryChecklist = checklistService.getChecklistByFarmType("Poultry")[0];
    if (poultryChecklist) {
      setChecklist(poultryChecklist);
      const initialResponses: Record<string, ResponseType> = {};
      const initialNotes: Record<string, string> = {};
      poultryChecklist.items.forEach((item: any) => {
        initialResponses[item.id] = "no";
        initialNotes[item.id] = "";
      });
      setFormData((prev) => ({
        ...prev,
        responses: initialResponses,
        notes: initialNotes,
      }));
    }

    if (assessmentId) {
      const existingAssessment = assessmentService.getAssessmentById(assessmentId);
      if (existingAssessment) {
        const responsesRecord: Record<string, ResponseType> = {};
        const notesRecord: Record<string, string> = {};
        existingAssessment.responses.forEach((r) => {
          responsesRecord[r.itemId] = r.response;
          notesRecord[r.itemId] = r.notes || "";
        });
        setFormData({
          farmId: existingAssessment.farmId,
          farmName: existingAssessment.farmName,
          farmType: existingAssessment.farmType,
          assessmentType: existingAssessment.assessmentType,
          dzongkhag: existingAssessment.dzongkhag,
          gewog: existingAssessment.gewog,
          responses: responsesRecord,
          notes: notesRecord,
        });
      }
    }
  }, [assessmentId]);

  useEffect(() => {
    if (checklist) {
      const score = checklistService.calculateScore(formData.responses, checklist.id);
      setCurrentScore(score);
    }
  }, [formData.responses, checklist]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleResponseChange = (itemId: string, response: ResponseType) => {
    setFormData((prev) => ({
      ...prev,
      responses: { ...prev.responses, [itemId]: response },
    }));
  };

  const handleNoteChange = (itemId: string, note: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: { ...prev.notes, [itemId]: note },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const responses = Object.entries(formData.responses).map(([itemId, response]) => ({
        itemId,
        response,
        notes: formData.notes[itemId],
      }));

      if (assessmentId) {
        assessmentService.updateAssessment(
          assessmentId,
          { responses, status: "Draft" },
          user?.id || "system"
        );
      } else {
        assessmentService.createAssessment(
          {
            farmId: formData.farmId,
            farmName: formData.farmName,
            farmType: formData.farmType,
            checklistId: checklist?.id || "CHK-001",
            checklistVersion: checklist?.version || "1.0",
            assessmentType: formData.assessmentType,
            responses,
            inspectorId: user?.id || "U002",
            inspectorName: user?.name || "Inspector",
            dzongkhag: formData.dzongkhag,
            gewog: formData.gewog,
            assessmentDate: new Date().toISOString().split("T")[0],
            status: "Draft",
            followUpRequired: false,
            nonConformities: [],
          },
          user?.id || "system"
        );
      }
      onSave();
    } catch (error) {
      console.error("Failed to save assessment:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const responses = Object.entries(formData.responses).map(([itemId, response]) => ({
        itemId,
        response,
        notes: formData.notes[itemId],
      }));

      if (assessmentId) {
        assessmentService.updateAssessment(
          assessmentId,
          { responses, status: "Submitted" },
          user?.id || "system"
        );
        assessmentService.submitAssessment(assessmentId, user?.id || "system");
      } else {
        const assessment = assessmentService.createAssessment(
          {
            farmId: formData.farmId,
            farmName: formData.farmName,
            farmType: formData.farmType,
            checklistId: checklist?.id || "CHK-001",
            checklistVersion: checklist?.version || "1.0",
            assessmentType: formData.assessmentType,
            responses,
            inspectorId: user?.id || "U002",
            inspectorName: user?.name || "Inspector",
            dzongkhag: formData.dzongkhag,
            gewog: formData.gewog,
            assessmentDate: new Date().toISOString().split("T")[0],
            status: "Submitted",
            followUpRequired: currentScore.complianceStatus !== "Compliant",
            nonConformities: [],
          },
          user?.id || "system"
        );
      }
      onSave();
    } catch (error) {
      console.error("Failed to submit assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedItems = checklist?.items.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (!checklist) {
    return <div className="p-8">Loading checklist...</div>;
  }

  return (
    <div className="flex-1 bg-[#e7efe9] p-4 lg:p-8 overflow-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onCancel} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#0b1f1a]" />
            </button>
            <div>
              <h2 className="text-[#0b1f1a] text-2xl lg:text-3xl font-bold">
                {assessmentId ? "Edit Assessment" : "New Assessment"}
              </h2>
              <p className="text-[#8a8a8a] text-sm">{checklist.name}</p>
            </div>
          </div>
        </div>

        {/* Farm Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Farm Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="farmName">Farm Name</Label>
                <Input
                  id="farmName"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="Enter farm name"
                />
              </div>
              <div>
                <Label htmlFor="farmType">Farm Type</Label>
                <Select value={formData.farmType} onValueChange={(value: any) => setFormData({ ...formData, farmType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poultry">Poultry</SelectItem>
                    <SelectItem value="Pig">Pig</SelectItem>
                    <SelectItem value="Cattle">Cattle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assessmentType">Assessment Type</Label>
                <Select value={formData.assessmentType} onValueChange={(value: any) => setFormData({ ...formData, assessmentType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On Request">On Request / New Farm Registration</SelectItem>
                    <SelectItem value="Regular">Regular / Planned Assessment</SelectItem>
                    <SelectItem value="Follow Up">Follow Up Assessment</SelectItem>
                    <SelectItem value="Complaint Based">Complaint Based Assessment</SelectItem>
                    <SelectItem value="Disease Outbreak">Assessment During Disease Outbreak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dzongkhag">Dzongkhag</Label>
                <Select value={formData.dzongkhag} onValueChange={(value) => setFormData({ ...formData, dzongkhag: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Thimphu">Thimphu</SelectItem>
                    <SelectItem value="Paro">Paro</SelectItem>
                    <SelectItem value="Punakha">Punakha</SelectItem>
                    <SelectItem value="Bumthang">Bumthang</SelectItem>
                    <SelectItem value="Wangdue">Wangdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gewog">Gewog</Label>
                <Input
                  id="gewog"
                  value={formData.gewog}
                  onChange={(e) => setFormData({ ...formData, gewog: e.target.value })}
                  placeholder="Enter gewog"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Summary */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0b1f1a]">Current Score</h3>
                <p className="text-sm text-[#8a8a8a]">
                  {currentScore.totalScore.toFixed(2)} / {currentScore.maxScore.toFixed(2)} points
                </p>
              </div>
              <Badge
                className={
                  currentScore.complianceStatus === "Compliant"
                    ? "bg-[#1a6b58]"
                    : currentScore.complianceStatus === "Moderate"
                    ? "bg-[#fbbf24]"
                    : "bg-[#c2410c]"
                }
              >
                {currentScore.complianceStatus}
              </Badge>
            </div>
            <Progress value={currentScore.percentage} className="h-2" />
            <p className="text-sm text-[#8a8a8a] mt-2">{currentScore.percentage.toFixed(1)}% Complete</p>
          </CardContent>
        </Card>

        {/* Checklist Items */}
        <div className="space-y-4 mb-6">
          {Object.entries(groupedItems || {}).map(([category, items]: [string, any]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection(category)}>
                  {category}
                  <span className="text-sm text-[#8a8a8a]">{items.length} items</span>
                </CardTitle>
              </CardHeader>
              {expandedSections.has(category) && (
                <CardContent className="space-y-4">
                  {items.map((item: any) => (
                    <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-[#0b1f1a] mb-1">{item.question}</p>
                          <Alert className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              <strong>Assessor's Guide:</strong> {item.assessorGuide}
                            </AlertDescription>
                          </Alert>
                        </div>
                        <Badge variant={item.mandatory ? "destructive" : "secondary"}>
                          {item.mandatory ? "Mandatory" : "Optional"}
                        </Badge>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <Button
                          size="sm"
                          variant={formData.responses[item.id] === "yes" ? "default" : "outline"}
                          className={formData.responses[item.id] === "yes" ? "bg-[#1a6b58]" : ""}
                          onClick={() => handleResponseChange(item.id, "yes")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Yes
                        </Button>
                        <Button
                          size="sm"
                          variant={formData.responses[item.id] === "partial" ? "default" : "outline"}
                          className={formData.responses[item.id] === "partial" ? "bg-[#fbbf24]" : ""}
                          onClick={() => handleResponseChange(item.id, "partial")}
                        >
                          Partial
                        </Button>
                        <Button
                          size="sm"
                          variant={formData.responses[item.id] === "no" ? "default" : "outline"}
                          className={formData.responses[item.id] === "no" ? "bg-[#c2410c]" : ""}
                          onClick={() => handleResponseChange(item.id, "no")}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          No
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`note-${item.id}`}>Notes</Label>
                        <Textarea
                          id={`note-${item.id}`}
                          value={formData.notes[item.id] || ""}
                          onChange={(e) => handleNoteChange(item.id, e.target.value)}
                          placeholder="Add notes or observations..."
                          rows={2}
                        />
                      </div>

                      {item.evidenceRequired && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            <Camera className="w-4 h-4 mr-1" />
                            Add Photo
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-1" />
                            Add Document
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#1a6b58] hover:bg-[#0b1f1a]">
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
