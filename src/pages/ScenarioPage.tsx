import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScenarioStore } from '../store/useScenarioStore';
import Button from '../components/common/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/common/Card';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';
import { Send, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Message {
    id: string;
    sender: 'ai' | 'user';
    text: string;
    timestamp: Date;
}

const ScenarioPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { scenarios, updateScenarioStatus } = useScenarioStore();

    const scenario = scenarios.find(s => s.id === id);

    const [messages, setMessages] = React.useState<Message[]>([]);
    const [inputText, setInputText] = React.useState('');
    const [isAiTyping, setIsAiTyping] = React.useState(false);
    const [sessionState, setSessionState] = React.useState<'intro' | 'active' | 'completed'>('intro');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Initialize state based on scenario status
    React.useEffect(() => {
        if (scenario?.status === 'COMPLETED') {
            setSessionState('completed');
        } else if (scenario?.status === 'IN_PROGRESS') {
            setSessionState('active');
        }
    }, [scenario]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, isAiTyping]);

    if (!scenario) {
        return (
            <div className="p-8 text-center">
                <Alert type="error">Scenario not found</Alert>
                <Link to="/dashboard" className="mt-4 inline-block text-primary-600 hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    const handleStart = () => {
        setSessionState('active');
        updateScenarioStatus(scenario.id, 'IN_PROGRESS');

        // Initial AI message
        setIsAiTyping(true);
        setTimeout(() => {
            const initialMessage: Message = {
                id: '1',
                sender: 'ai',
                text: `Roleplay Started: ${scenario.title}. I am ready to begin. You are the teacher. How do you want to start the class?`,
                timestamp: new Date()
            };
            setMessages([initialMessage]);
            setIsAiTyping(false);
        }, 1500);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsAiTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponseText = messages.length > 3
                ? "Excellent handling of the situation. Let's wrap up this scenario."
                : `I understand. (Simulated student response to: "${userMsg.text}")`;

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: aiResponseText,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsAiTyping(false);

            // End scenario after a few turns for demo
            if (messages.length > 3) {
                setTimeout(() => handleComplete(), 2000);
            }
        }, 2000);
    };

    const handleComplete = () => {
        setSessionState('completed');
        // Random mock score between 70 and 100
        const mockScore = Math.floor(Math.random() * 30) + 70;
        updateScenarioStatus(scenario.id, 'COMPLETED', mockScore);
    };

    if (sessionState === 'intro') {
        return (
            <div className="max-w-3xl mx-auto py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{scenario.title}</CardTitle>
                        <p className="text-gray-500 mt-2">Estimated Duration: 10-15 mins</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h3 className="font-semibold text-blue-900 mb-2">Scenario Description</h3>
                            <p className="text-blue-800">{scenario.description}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Learning Objectives</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>Practice active listening techniques</li>
                                <li>Apply conflict resolution strategies</li>
                                <li>Maintain professional composure under pressure</li>
                            </ul>
                        </div>

                        <Alert type="info" title="Instructions">
                            You will interact with an AI persona. Respond as you would in a real classroom setting. Your performance will be evaluated on empathy, clarity, and effectiveness.
                        </Alert>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-gray-100 pt-6">
                        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button size="lg" onClick={handleStart}>
                            Start Roleplay
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (sessionState === 'completed') {
        return (
            <div className="max-w-3xl mx-auto py-8 text-center">
                <Card className="border-t-4 border-t-green-500">
                    <CardContent className="pt-12 pb-12 space-y-6">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Scenario Completed!</h2>
                            <p className="text-gray-600 mt-2">You have successfully finished the {scenario.title} scenario.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl max-w-sm mx-auto">
                            <span className="text-gray-500 font-medium uppercase text-xs tracking-wider">Performance Score</span>
                            <div className="text-5xl font-extrabold text-primary-600 mt-1">{scenario.score}/100</div>
                        </div>

                        <div className="space-y-2 text-left bg-white border border-gray-100 p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-gray-900">AI Feedback Summary:</h3>
                            <p className="text-gray-600">You demonstrated strong empathy and patience. However, try to be more firm when setting boundaries in the future.</p>
                        </div>

                        <Button size="lg" onClick={() => navigate('/dashboard')} className="min-w-[200px]">
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Active Chat UI
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
                <div>
                    <h2 className="font-bold text-gray-900">{scenario.title}</h2>
                    <span className="text-xs text-green-600 flex items-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                        Live Session
                    </span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    Quit Session
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === 'user'
                            ? 'bg-primary-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                            }`}>
                            <p className="text-sm">{msg.text}</p>
                            <span className={`text-[10px] mt-1 block opacity-70 ${msg.sender === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>
                                {msg.sender === 'ai' ? 'AI Persona' : 'You'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                {isAiTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                            <div className="flex space-x-1.5">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your response..."
                        className="flex-1"
                        disabled={isAiTyping}
                        autoFocus
                    />
                    <Button type="submit" disabled={!inputText.trim() || isAiTyping}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

// Need to import Link separately or change usage
import { Link } from 'react-router-dom';

export default ScenarioPage;
