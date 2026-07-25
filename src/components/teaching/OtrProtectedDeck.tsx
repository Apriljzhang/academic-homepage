import AssessmentForLearningDeck from "./AssessmentForLearningDeck";
import OtrAccessGate from "./OtrAccessGate";

export default function OtrProtectedDeck() {
  return (
    <OtrAccessGate>
      <AssessmentForLearningDeck />
    </OtrAccessGate>
  );
}
