import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import SectionHeader from "./section-header";
import QAData from "@/db/QA.json";

const Questions = () => {
  const { questions } = QAData as { questions: { question: string; answer: string }[] };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader title="سوالات متداول" description="سوالات متداول" />

      <div className="grid grid-cols-1 max-w-[600px] mx-auto gap-4 sm:gap-6 w-full px-1">
        <Accordion
          type="single"
          collapsible
          className="w-full  flex flex-col gap-6"
        >
          {questions.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-right">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-right">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Questions;
