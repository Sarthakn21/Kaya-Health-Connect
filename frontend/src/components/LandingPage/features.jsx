import {
    Card, CardHeader, CardTitle, CardContent, CardDescription
} from "@/components/ui/card";

const Features = () => {
    return (
        <div className="gap-y-4">
            <div className="text-4xl font-semibold">Key Features</div>
            <div className="text-lg pt-5">KayaHealth Connect provides a comprehensive suite of features designed to streamline operations and improve patient care.</div>
            <div className="pt-10 flex flex-row gap-x-5">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Appointment Scheduling</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Allow patients to book appointments online and manage their bookings.</CardDescription>
                    </CardContent>
                </Card>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Patient Care</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Patient Care is at heart of KayaHealth Connect. We help you deliver personalized, high-quality, care-efficiently and effectively</CardDescription>
                    </CardContent>
                </Card>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Physician</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Physician play a critical role in the healthcare system. They diagnose, treat, and manage patient care to promote health and well being</CardDescription>
                    </CardContent>
                </Card>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Clinical Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Clinical Data is the foundation of modern healthcare. It helps providers make informed decisions, improve patient outcomes, and manage Population health.</CardDescription>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
export default Features;
